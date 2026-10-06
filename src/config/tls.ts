/**
 * Indica se ESTA instância da API está servindo HTTPS.
 *
 * O redirecionamento HTTP → HTTPS só faz sentido quando a própria API termina o
 * TLS. Em produção atrás de um proxy (que termina o TLS e encaminha em HTTP),
 * redirecionar entraria em loop, porque `req.secure` é falso a menos que
 * TRUST_PROXY esteja configurado. Quem define isto é src/server.ts, ao subir o
 * servidor seguro.
 */
let servingHttps = false;

export const markServingHttps = (): void => {
    servingHttps = true;
};

export const isServingHttps = (): boolean => servingHttps;
