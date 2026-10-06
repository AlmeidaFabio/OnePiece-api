# 🏴‍☠️ One Piece API

> "I'm gonna be King of the Pirates!" — Monkey D. Luffy

API REST com dados de personagens de One Piece: CRUD, busca com filtros e paginação, upload de imagens e autenticação de administrador.

## 🌟 Recursos

- **Personagens** — criação, leitura, atualização e exclusão, com validação de entrada pelo Zod
- **Busca e filtros** — busca textual em nome, descrição, tripulação e Akuma no Mi; filtros por tripulação e faixa de recompensa; tudo paginado
- **Imagens** — upload em `multipart/form-data`, processado com `sharp` (redimensionado para 300px, sempre `.jpg`, até 2MB) e servido em `/images/<arquivo>`
- **Autenticação** — login de admin com JWT e senha em bcrypt; rotas de escrita protegidas
- **Proteções** — `helmet`, CORS por allowlist, rate limit no login e erros sempre em JSON (sem stack trace ou caminho interno)

## 🛠️ Stack

| Categoria | Tecnologias                                |
| --------- | ------------------------------------------ |
| Runtime   | Node.js (>= 20.9), TypeScript              |
| HTTP      | Express 4                                  |
| Banco     | PostgreSQL, Prisma 7 (driver adapter `pg`) |
| Validação | Zod                                        |
| Segurança | JWT, bcrypt, helmet, express-rate-limit    |
| Imagens   | Multer (memória) + sharp                   |
| Testes    | Vitest + Supertest                         |
| DevOps    | Docker, Docker Compose                     |

## 🚀 Começando

### Pré-requisitos

- Node.js 20.9 ou superior
- PostgreSQL em execução (ou o `docker-compose` deste repositório, que sobe apenas o banco)

### Instalação

```bash
git clone https://github.com/AlmeidaFabio/OnePiece-api
cd OnePiece-api
npm install
```

O `npm install` roda `prisma generate` automaticamente (script `postinstall`).

### Configuração

```bash
cp .env.example .env
```

As variáveis obrigatórias são `DATABASE_URL` e `JWT_SECRET` — sem elas a aplicação não sobe. O arquivo de exemplo traz todas comentadas:

| Variável                                              | Padrão        | Descrição                                                                                                             |
| ----------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                                            | `development` | Em `production` a API sobe HTTP e HTTPS, exige `SSL_KEY`/`SSL_CERT` e redireciona HTTP para HTTPS (308).              |
| `PORT`                                                | `9000`        | Porta do servidor em desenvolvimento.                                                                                 |
| `HTTP_PORT`                                           | `80`          | Porta HTTP em produção.                                                                                               |
| `HTTPS_PORT`                                          | `443`         | Porta HTTPS em produção.                                                                                              |
| `SSL_KEY` / `SSL_CERT`                                | —             | Obrigatórias em produção: caminhos dos arquivos PEM.                                                                  |
| `DATABASE_URL`                                        | —             | **Obrigatória.** String de conexão usada pelo Prisma.                                                                 |
| `JWT_SECRET`                                          | —             | **Obrigatória.** Segredo que assina e verifica os tokens.                                                             |
| `JWT_EXPIRES_IN`                                      | `1d`          | Validade do token (`1d`, `12h`, `3600`...).                                                                           |
| `BASE_URL`                                            | —             | URL base usada pela página inicial renderizada em `GET /api`.                                                         |
| `CORS_ORIGINS`                                        | _(vazio)_     | Origens permitidas, separadas por vírgula. Vazio = qualquer origem é aceita **e um aviso é impresso no boot**.        |
| `TRUST_PROXY`                                         | _(vazio)_     | Número de hops confiáveis, ou IP/sub-rede. Necessário atrás de proxy para o rate limit enxergar o IP real do cliente. |
| `TEST_DATABASE_URL`                                   | derivada      | Banco usado pelos testes. Se ausente, é a `DATABASE_URL` com o sufixo `_test`.                                        |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD`                      | —             | Alternativa a passar os argumentos em `npm run admin:create`.                                                         |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | —             | Lidas **pelo `docker-compose`**, não pela aplicação.                                                                  |

> `BASE_URL` e `PORT` aparecem na página inicial, mas a URL das imagens enviadas é montada a partir da própria requisição — não dependem delas.

### Banco de dados

```bash
npx prisma migrate deploy   # aplica as migrations
npm run seed                # popula 67 personagens (idempotente)
```

### Primeiro administrador

`POST /api/admin` exige autenticação, então o primeiro admin é criado por linha de comando:

```bash
npm run admin:create -- admin@exemplo.com "SuaSenha1!"
# ou, sem deixar a senha no histórico do shell:
ADMIN_EMAIL=admin@exemplo.com ADMIN_PASSWORD="SuaSenha1!" npm run admin:create
```

O comando valida a senha pelas mesmas regras da API (mínimo 6 caracteres, com maiúscula, minúscula, número e caractere especial) e funciona também como redefinição de senha.

### Rodando

```bash
npm run dev      # desenvolvimento, com reload automático
npm run build    # compila para build/
npm start        # executa o build
```

## 📜 Scripts

| Script                              | O que faz                                               |
| ----------------------------------- | ------------------------------------------------------- |
| `npm run dev`                       | Servidor de desenvolvimento com reload (`ts-node-dev`). |
| `npm run build` / `npm start`       | Compila para `build/` e executa o resultado.            |
| `npm test` / `npm run test:watch`   | Testes automatizados (Vitest).                          |
| `npm run typecheck`                 | Checagem de tipos de `src/` **e** `tests/`.             |
| `npm run lint` / `npm run lint:fix` | ESLint sobre todo o projeto.                            |
| `npm run format` / `format:check`   | Prettier: formata ou só verifica.                       |
| `npm run seed`                      | Popula o banco (upsert, sem apagar os demais).          |
| `npm run admin:create`              | Cria ou redefine a senha de um admin.                   |
| `npm run prisma:migrate`            | Cria/aplica migration em desenvolvimento (interativo).  |
| `npm run prisma:studio`             | Abre o Prisma Studio.                                   |

## 🔐 Autenticação

```bash
curl -X POST http://localhost:9000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exemplo.com","password":"SuaSenha1!"}'
```

```json
{
    "admin": { "id": "f0b6c1fd-...", "email": "admin@exemplo.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Envie o token nas rotas protegidas: `Authorization: Bearer <token>`.

O login aceita **10 tentativas por 15 minutos por IP**; a partir da 11ª a resposta é `429` com `Retry-After`. Atrás de proxy, configure `TRUST_PROXY` para o limite ser por cliente e não global. A expiração vem de `JWT_EXPIRES_IN` e o algoritmo é fixo em HS256.

## 📚 Endpoints

Base: `/api`

### Personagens

| Método | Rota                     | Auth | Descrição                                                   |
| ------ | ------------------------ | ---- | ----------------------------------------------------------- |
| GET    | `/api/characters`        | —    | Lista com filtros e paginação.                              |
| GET    | `/api/characters/search` | —    | Busca textual em nome, descrição, tripulação e Akuma no Mi. |
| GET    | `/api/characters/:id`    | —    | Busca por ID (UUID).                                        |
| POST   | `/api/characters`        | ✅   | Cria personagem (JSON ou `multipart/form-data`).            |
| PUT    | `/api/characters/:id`    | ✅   | Atualiza campos enviados.                                   |
| DELETE | `/api/characters/:id`    | ✅   | Remove o personagem **e o arquivo da imagem**.              |

### Admin

| Método | Rota                 | Auth | Descrição                                                  |
| ------ | -------------------- | ---- | ---------------------------------------------------------- |
| POST   | `/api/admin/auth`    | —    | Login; devolve o token.                                    |
| POST   | `/api/admin`         | ✅   | Cria um admin. Duplicado responde `409`.                   |
| GET    | `/api/admin/profile` | ✅   | Dados do admin do token. Admin inexistente responde `404`. |

### Outras

| Método | Rota                | Descrição                                        |
| ------ | ------------------- | ------------------------------------------------ |
| GET    | `/api`              | Página inicial em HTML com a lista de endpoints. |
| GET    | `/images/<arquivo>` | Imagens enviadas.                                |

## 🔎 Filtros e paginação

`GET /api/characters` aceita:

| Parâmetro                 | Regra                                                                 |
| ------------------------- | --------------------------------------------------------------------- |
| `name`                    | Trecho do nome, de 3 a 100 caracteres (sem diferenciar maiúsculas).   |
| `crew`                    | Trecho da tripulação, de 3 a 100 caracteres.                          |
| `hasDevilFruit`           | `true` ou `false`.                                                    |
| `minBounty` / `maxBounty` | Inteiros a partir de 0. `minBounty` maior que `maxBounty` é recusado. |
| `page`                    | Inteiro >= 1 (padrão `1`). Página além do fim devolve a última.       |
| `limit`                   | Inteiro de 1 a 100 (padrão `10`).                                     |

Parâmetro vazio (`?name=`) é tratado como ausente. Qualquer valor fora da regra responde `400` apontando o campo.

`GET /api/characters/search` aceita `q` (obrigatório, até 100 caracteres), `page` e `limit`. **Sem resultados a resposta é `200` com a lista vazia.**

```bash
curl "http://localhost:9000/api/characters?crew=Marinha&limit=5"
```

```json
{
    "status": "success",
    "data": {
        "characters": [
            {
                "id": "11095342-e4c2-47b9-aac3-448424aad848",
                "name": "Aramaki",
                "description": "Conhecido como 'Ryokugyu', é um dos Almirantes da Marinha...",
                "bounty": 0,
                "devilFruit": "Mori Mori no Mi",
                "crew": "Marinha",
                "createdAt": "2026-06-30T22:16:09.617Z",
                "updatedAt": "2026-10-06T15:57:30.475Z"
            }
        ],
        "pagination": {
            "total": 17,
            "page": 1,
            "limit": 5,
            "totalPages": 4,
            "hasNextPage": true,
            "hasPreviousPage": false,
            "nextPage": 2,
            "previousPage": null
        }
    }
}
```

`bounty` é **sempre** um número — `0` significa "sem recompensa conhecida", o caso da Marinha, do Governo Mundial e do CP0. Já `devilFruit`, `crew` e `image` são **omitidos** quando não preenchidos. Quando o personagem tem imagem enviada, `image` traz a URL pública (`http://localhost:9000/images/<32 caracteres hex>.jpg`).

## 🖼️ Imagens

Envie como `multipart/form-data` no campo `image`:

```bash
curl -X POST http://localhost:9000/api/characters \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Monkey D. Luffy" \
  -F "description=Capitão dos Piratas do Chapéu de Palha" \
  -F "bounty=3000000000" \
  -F "image=@luffy.png"
```

- Aceita apenas `image/jpeg` e `image/png`, até **2MB** (acima disso: `400`).
- O arquivo é convertido para **JPEG**, redimensionado para 300px de largura e gravado em `public/images` com nome aleatório.
- Um `PUT` com nova imagem substitui a anterior e **apaga o arquivo antigo**; excluir o personagem também remove o arquivo. Nenhuma requisição rejeitada deixa arquivo órfão.

## ⚠️ Formato dos erros

Erros de validação (`400`) apontam o campo:

```json
{ "error": "Validation Error", "details": [{ "path": "bounty", "message": "Recompensa muito alta" }] }
```

Demais erros da API de personagens e das respostas globais:

```json
{ "status": "error", "message": "Character with ID 11111111-1111-1111-1111-111111111111 not found" }
```

As rotas de admin ainda usam um formato mais antigo, sem `status`:

```json
{ "error": "Invalid credentials" }
```

Unificar esses dois formatos está na lista de melhorias do projeto.

Códigos usados: `400` validação ou ID malformado · `401` sem token ou credenciais inválidas · `404` recurso inexistente · `409` nome ou e-mail já cadastrado · `429` rate limit do login · `500` falha inesperada (sempre sem detalhes internos).

## 🧪 Testes

```bash
npm test          # executa a suíte
npm run typecheck # checagem de tipos de src/ e tests/
npm run lint      # ESLint
npm run format    # Prettier
```

Os testes rodam contra um **banco separado**, criado e migrado automaticamente a partir da `DATABASE_URL` com o sufixo `_test` (`onepiece` → `onepiece_test`). O banco de desenvolvimento não é tocado. Use `TEST_DATABASE_URL` para apontar para outro lugar.

A suíte cobre autenticação, rate limit, validação de query e de parâmetros, CRUD, busca paginada e o pipeline de imagens.

> Se você adicionar muitos testes que fazem login, lembre-se do limite de 10 tentativas por 15 minutos: reutilize o token entre os casos (a suíte atual faz um login por arquivo).

## 🐳 Docker

O `docker-compose.yml` sobe o ambiente completo — PostgreSQL, migrations e API:

```bash
docker compose up -d --build
```

A ordem é garantida pelo compose: o banco só é considerado pronto quando o healthcheck (`pg_isready`) passa; o serviço `migrate` aplica as migrations; e a API só inicia quando elas terminam com sucesso. Além disso a própria API verifica o banco antes de escutar, então um banco fora do ar faz o processo encerrar em vez de aceitar tráfego quebrado.

### Popular o banco e criar o admin

Os scripts operacionais vão compilados na imagem, sem precisar de `ts-node`:

```bash
docker compose exec api node build/database/seed.js
docker compose exec api node build/database/createAdmin.js admin@exemplo.com "SuaSenha1!"
```

### TLS

Dentro do container a API sobe em **HTTP** (porta `PORT`, padrão 9000) e o TLS deve terminar no seu proxy. Para servir HTTPS direto do container, aponte `SSL_KEY` e `SSL_CERT` para caminhos **de dentro do container** e monte os certificados em um volume — a API só usa TLS quando os dois arquivos existem; sem eles ela avisa e segue em HTTP.

### Persistência

| Volume          | Guarda                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `postgres_data` | Os dados do banco.                                                                                   |
| `images`        | As imagens enviadas (`/app/public/images`), que de outro modo sumiriam a cada recreate do container. |

`docker compose down` preserva os volumes; `docker compose down -v` apaga tudo, inclusive os dados.

## 📄 Licença

Distribuído sob a licença **MIT** — veja [LICENSE](LICENSE).

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## 🙏 Agradecimentos

- Eiichiro Oda, por criar One Piece
- A comunidade One Piece pelo apoio
- Todos que contribuíram com o projeto

---

Feito com ❤️ por Fábio Almeida
