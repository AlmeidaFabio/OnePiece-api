import { Pool } from 'pg';
import env from '../utils/env';

const pool = new Pool({
  connectionString: env.requireEnv('DATABASE_URL'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let isConnected = false;
let isConnecting = false;

// Testar conexão ao iniciar
export const connectDB = async (attempt = 1) => {
  if (isConnected || isConnecting) {
    return;
  }

  isConnecting = true;

  try {
    await pool.query('SELECT NOW()');
    isConnected = true;
    console.log('✅ PostgreSQL conectado com sucesso!');
  } catch (err) {
    console.warn(`⚠️ Falha ao conectar ao PostgreSQL (tentativa ${attempt}). Tentando novamente em 3s...`);

    if (attempt < 5) {
      setTimeout(() => {
        isConnecting = false;
        void connectDB(attempt + 1);
      }, 3000);
      return;
    }

    console.error('❌ Não foi possível conectar ao PostgreSQL após várias tentativas.', err);
  } finally {
    if (isConnected) {
      isConnecting = false;
    }
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