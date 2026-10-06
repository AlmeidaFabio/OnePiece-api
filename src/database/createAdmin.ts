/**
 * Cria (ou redefine a senha de) um admin.
 *
 * Existe porque POST /api/admin exige autenticação — sem um caminho fora da API
 * não há como criar o primeiro admin e o login nunca poderia ser usado.
 *
 * Uso:
 *   npm run admin:create -- admin@exemplo.com "Senha1!"
 *   ADMIN_EMAIL=admin@exemplo.com ADMIN_PASSWORD="Senha1!" npm run admin:create
 *
 * Prefira as variáveis de ambiente: argumentos de linha de comando ficam
 * visíveis na lista de processos do sistema operacional.
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAdminSchema } from '../validations/adminValidations';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = process.argv[2] ?? process.env.ADMIN_EMAIL;
    const password = process.argv[3] ?? process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error('❌ Informe e-mail e senha.');
        console.error('   npm run admin:create -- <email> <senha>');
        console.error('   ou defina ADMIN_EMAIL e ADMIN_PASSWORD no ambiente.');
        process.exit(1);
    }

    const parsed = createAdminSchema.safeParse({ email, password });

    if (!parsed.success) {
        console.error('❌ Dados inválidos:');
        for (const issue of parsed.error.errors) {
            console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
        }
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    // upsert: cria se não existir, redefine a senha se já existir.
    const admin = await prisma.admin.upsert({
        where: { email: parsed.data.email },
        update: { password: hashedPassword },
        create: { email: parsed.data.email, password: hashedPassword },
        select: { id: true, email: true }
    });

    console.log(`✅ Admin pronto: ${admin.email} (${admin.id})`);
    console.log('   Faça login em POST /api/admin/auth com essas credenciais.');
}

main()
    .catch((error) => {
        console.error('❌ Falha ao criar admin:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
