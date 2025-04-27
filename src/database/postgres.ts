import { Pool } from 'pg';
import env from '../utils/env';

const pool = new Pool({
  connectionString: env.requireEnv('DATABASE_URL'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testar conexão ao iniciar
export const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL conectado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', err);
    process.exit(1);
  }
};

export const query = async (text: string, params?: any[]) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`✅ Query executada em ${duration}ms`);
    return res;
  } catch (err) {
    console.error('❌ Erro na query:', err);
    throw err;
  }
};

export default { query, connectDB };