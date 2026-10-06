import 'dotenv/config';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { app } from './app';
import { connectDB } from './database/connect';
import { markServingHttps } from './config/tls';

const runServer = (port: number, server: http.Server | https.Server, protocol: 'http' | 'https') => {
    server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') throw error;

        const messages: Record<string, string> = {
            EACCES: `❌ Port ${port} requires elevated privileges`,
            EADDRINUSE: `❌ Port ${port} is already in use`
        };
        console.error(messages[error.code!] || `❌ Server error: ${error.message}`);
        process.exit(1);
    });

    server.on('listening', () => {
        const addr = server.address();
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
        console.log(`✅ ${protocol.toUpperCase()} Server listening on ${bind}`);
    });

    server.listen(port);
};

const httpPort = parseInt(process.env.HTTP_PORT || '80', 10);
const httpsPort = parseInt(process.env.HTTPS_PORT || '443', 10);
const plainPort = parseInt(process.env.PORT || '9000', 10);

/**
 * TLS é usado quando os dois caminhos estão configurados **e** os arquivos
 * existem. Checar a existência evita derrubar o boot quando o `.env` aponta para
 * certificados indisponíveis no processo — o caso de um caminho do host que não
 * existe dentro de um container. Nessa situação a API serve HTTP puro, para o
 * TLS terminar em um proxy.
 */
const sslPaths = (): { key: string; cert: string } | null => {
    const key = process.env.SSL_KEY;
    const cert = process.env.SSL_CERT;

    if (!key || !cert) return null;
    if (!fs.existsSync(key) || !fs.existsSync(cert)) return null;

    return { key, cert };
};

const startServers = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const ssl = isProduction ? sslPaths() : null;

    if (ssl) {
        // Avisa o app que ele pode redirecionar HTTP -> HTTPS. O redirect vive em
        // app.ts, antes das rotas: aqui ele era registrado depois delas e só
        // afetava requisições que davam 404.
        markServingHttps();

        const secureServer = https.createServer(
            { key: fs.readFileSync(ssl.key), cert: fs.readFileSync(ssl.cert) },
            app
        );
        const plainServer = http.createServer(app);

        runServer(httpPort, plainServer, 'http');
        runServer(httpsPort, secureServer, 'https');
        return;
    }

    if (isProduction) {
        console.warn(
            `⚠️ SSL_KEY/SSL_CERT não configurados (ou arquivos ausentes): servindo HTTP na porta ${plainPort}. ` +
                'Termine o TLS no seu proxy.'
        );
    }

    const plainServer = http.createServer(app);
    runServer(plainPort, plainServer, 'http');
};

/**
 * O banco é verificado ANTES de o servidor começar a escutar. Se estiver fora, o
 * processo encerra com mensagem clara em vez de aceitar tráfego e responder erro
 * a cada requisição (era o que acontecia: connectDB não era aguardado).
 */
const bootstrap = async () => {
    await connectDB();
    startServers();
};

bootstrap().catch((error: unknown) => {
    console.error('❌ Falha ao iniciar o servidor:', error instanceof Error ? error.message : error);
    process.exit(1);
});

// Erros globais
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'Reason:', reason);
    process.exit(1);
});
