function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        console.error(`❌ Variável de ambiente obrigatória: ${name}`);
        process.exit(1);
    }
    return value;
}

export default { requireEnv };