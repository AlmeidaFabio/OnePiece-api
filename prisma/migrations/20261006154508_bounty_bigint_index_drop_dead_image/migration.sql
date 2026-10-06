-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_characterId_fkey";

-- AlterTable
-- bounty passa de double precision para BIGINT: e um valor inteiro e 6 fichas
-- semeadas ultrapassam o limite do INTEGER (2.147.483.647) — a maior e 4.048.900.000.
-- O cast de double precision para bigint e implicito no PostgreSQL (assignment cast),
-- entao nao e necessario USING.
ALTER TABLE "Character" ALTER COLUMN "bounty" SET DEFAULT 0,
ALTER COLUMN "bounty" SET DATA TYPE BIGINT;

-- DropTable
-- Modelo Image nunca foi usado por nenhuma rota (a imagem real vive em
-- Character.image) e a tabela estava com 0 linhas.
DROP TABLE "Image";

-- CreateIndex
CREATE INDEX "Character_bounty_idx" ON "Character"("bounty");

-- CreateIndex (indices de texto)
-- Os filtros de texto da API usam contains + mode: insensitive, que o Prisma
-- traduz para ILIKE '%valor%'. Um indice B-tree NAO atende wildcard a esquerda,
-- entao as colunas filtradas por texto usam GIN com pg_trgm. O Prisma nao
-- representa esse tipo de indice no schema, por isso o SQL e escrito a mao.
-- pg_trgm e uma extensao confiavel desde o PostgreSQL 13, portanto o dono do
-- banco pode instala-la; se o seu banco gerenciado nao permitir, remova as
-- quatro linhas de CREATE INDEX abaixo e a API continua funcionando (so sem
-- aceleracao na busca textual).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "Character_name_trgm_idx" ON "Character" USING gin (name gin_trgm_ops);
CREATE INDEX "Character_description_trgm_idx" ON "Character" USING gin (description gin_trgm_ops);
CREATE INDEX "Character_crew_trgm_idx" ON "Character" USING gin (crew gin_trgm_ops);
CREATE INDEX "Character_devilFruit_trgm_idx" ON "Character" USING gin ("devilFruit" gin_trgm_ops);
