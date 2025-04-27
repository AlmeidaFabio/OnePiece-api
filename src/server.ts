import 'dotenv/config';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { app } from './app';
import { connectDB } from './database/postgres';
import env from './utils/env';


const runServer = (
    port: number,
    server: http.Server | https.Server,
    protocol: 'http' | 'https'
) => {
    server.listen(port, () => {
        console.log(`✅ ${protocol.toUpperCase()} Server is running on port ${port}`);
    });

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
};

const httpPort = parseInt(process.env.HTTP_PORT || '80', 10);
const httpsPort = parseInt(process.env.HTTPS_PORT || '443', 10);
const devPort = parseInt(process.env.PORT || '9000', 10);

connectDB();

if (process.env.NODE_ENV === 'production') {
    const sslKey = fs.readFileSync(env.requireEnv('SSL_KEY'));
    const sslCert = fs.readFileSync(env.requireEnv('SSL_CERT'));

    // Redireciona HTTP → HTTPS
    app.use((req, res, next) => {
        const proto = req.headers['x-forwarded-proto'];
        if (proto && proto !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });

    const secureServer = https.createServer({ key: sslKey, cert: sslCert }, app);
    const plainServer = http.createServer(app);

    runServer(httpPort, plainServer, 'http');
    runServer(httpsPort, secureServer, 'https');
} else {
    const devServer = http.createServer(app);
    runServer(devPort, devServer, 'http');
}

// Erros globais
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'Reason:', reason);
    process.exit(1);
});
