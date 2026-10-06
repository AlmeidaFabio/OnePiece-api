import express, { NextFunction, Request, Response } from 'express';
import mustache from 'mustache-express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import router from './routes';
import { AppError } from './errors/AppError';
import { isServingHttps } from './config/tls';

const app = express();

// Atrás de proxy (Nginx, Heroku, etc.) o IP real chega em X-Forwarded-For.
// Sem isso, o rate limit do login contaria todos os clientes como um só IP.
// "true" vira 1 (um hop) em vez de confiança irrestrita, que o express-rate-limit
// sinaliza como configuração insegura.
const rawTrustProxy = process.env.TRUST_PROXY;
if (rawTrustProxy) {
    const value = rawTrustProxy === 'true' ? 1 : /^\d+$/.test(rawTrustProxy) ? Number(rawTrustProxy) : rawTrustProxy;
    app.set('trust proxy', value);
}

app.use(
    helmet({
        // As imagens enviadas ficam em /images e são servidas para serem exibidas em
        // outras origens (um front separado). O padrão "same-origin" bloquearia isso.
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
);

// CORS por allowlist: CORS_ORIGINS="https://app.exemplo.com,https://admin.exemplo.com".
// Sem a variável, mantém o comportamento anterior (qualquer origem) e avisa no boot.
const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

if (corsOrigins.length === 0) {
    console.warn('⚠️ CORS_ORIGINS não definido: qualquer origem é aceita. Defina a lista para restringir.');
}

app.use(cors(corsOrigins.length > 0 ? { origin: corsOrigins } : undefined));

// Em produção, força HTTPS antes de qualquer rota — mas só quando esta instância
// realmente serve HTTPS (ver src/config/tls.ts): atrás de um proxy que termina o
// TLS, redirecionar entraria em loop.
// Duas correções em relação ao código anterior, que vivia em server.ts:
// (1) era registrado DEPOIS de app.ts já ter montado as rotas, então só alcançava
//     requisições que não casavam com rota nenhuma — na prática, apenas os 404;
// (2) decidia pelo header x-forwarded-proto em vez da conexão real.
// req.secure olha a conexão e respeita X-Forwarded-Proto quando TRUST_PROXY está
// configurado. O 308 preserva método e corpo, então um POST não vira GET.
if (process.env.NODE_ENV === 'production') {
    app.use((request: Request, response: Response, next: NextFunction) => {
        if (!isServingHttps() || request.secure) {
            return next();
        }

        const host = request.headers.host;
        if (!host) {
            return next();
        }

        return response.redirect(308, `https://${host}${request.originalUrl}`);
    });
}

app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, '../public/views'));
app.engine('mustache', mustache());

// Limite explícito do corpo JSON (o padrão do Express é 100kb; deixamos claro).
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use('/api', router);

// 404 em JSON para a API (antes caía no HTML padrão do Express).
app.use('/api', (request: Request, response: Response) => {
    return response.status(404).json({
        status: 'error',
        message: `Route ${request.method} ${request.originalUrl} not found`
    });
});

// Handler de erro global: responde sempre JSON e nunca devolve stack trace,
// caminhos absolutos do servidor ou mensagens internas do Prisma.
app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    if (response.headersSent) {
        return next(error);
    }

    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }

    const err = error as { status?: unknown; statusCode?: unknown; name?: unknown };

    if (err?.name === 'MulterError') {
        const message =
            (err as { code?: unknown }).code === 'LIMIT_FILE_SIZE'
                ? 'Imagem maior que o limite de 2MB'
                : 'Falha no upload do arquivo';

        return response.status(400).json({ status: 'error', message });
    }

    // JSON malformado e afins já trazem o status 4xx correto no próprio erro.
    const status =
        typeof err?.status === 'number' ? err.status : typeof err?.statusCode === 'number' ? err.statusCode : undefined;

    if (status && status >= 400 && status < 500) {
        return response.status(status).json({ status: 'error', message: 'Invalid request' });
    }

    console.error('❌ Erro não tratado:', error);
    return response.status(500).json({ status: 'error', message: 'Internal server error' });
});

export { app };
