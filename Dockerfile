# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build: instala tudo, gera o Prisma Client e compila o TypeScript.
# O estágio tem ferramentas de compilação porque o bcrypt é um módulo nativo e
# pode precisar compilar caso não exista binário pronto para a versão do Node.
# ---------------------------------------------------------------------------
FROM node:24-bookworm-slim AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

# O postinstall roda `prisma generate`, então o schema precisa existir ANTES do
# npm ci. Aqui vão só o schema e a config: assim alterações em migrations não
# invalidam a camada de dependências (o resto de prisma/ é copiado depois).
COPY prisma.config.ts ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm ci

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

# Remove as dependências de desenvolvimento depois de compilar, mantendo os
# módulos nativos já construídos.
RUN npm prune --omit=dev


# ---------------------------------------------------------------------------
# Runtime: apenas o necessário para executar. Sem ferramentas de build.
# ---------------------------------------------------------------------------
FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/prisma.config.ts ./
COPY --chown=node:node package.json ./
COPY --chown=node:node public ./public

# O build inclui os scripts operacionais, então eles rodam sem o ts-node:
#   docker compose exec api node build/database/seed.js
#   docker compose exec api node build/database/createAdmin.js <email> <senha>
#   docker compose exec api npx prisma migrate deploy

USER node

EXPOSE 9000

CMD ["node", "build/server.js"]
