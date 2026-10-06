# Contribuindo

Obrigado pelo interesse em contribuir com a One Piece API! Este documento descreve o básico para a sua contribuição ser aceita sem idas e voltas.

## Antes de abrir um Pull Request

```bash
npm install
npm run lint         # precisa passar
npm run format:check # precisa passar
npm run typecheck    # precisa passar
npm test             # precisa passar
npm run build        # precisa passar
```

Tudo isso roda no CI a cada push e Pull Request (`.github/workflows/ci.yml`), que também constrói a imagem Docker.

Os testes usam um banco separado, criado e migrado automaticamente — você não precisa preparar nada além de ter o PostgreSQL rodando e a `DATABASE_URL` no `.env`.

## Padrões do projeto

- **Camadas:** `routes` → `controllers` → `useCases` → `repositories`. Controller não fala com o Prisma direto; regra de negócio fica no use case.
- **Validação** sempre com Zod, em `src/validations/`, aplicada pelo middleware `validateRequest` — informe a origem (`'query'` ou `'params'`) quando não for o corpo da requisição.
- **Erros de domínio** usam `AppError` com o status HTTP. Não classifique erro por `error.message.includes(...)` e não deixe mensagem do Prisma chegar ao cliente.
- **Migrations:** nunca edite uma migration já aplicada. Crie uma nova:

    ```bash
    npx prisma migrate dev --create-only --name descricao_curta
    # revise o SQL gerado e então aplique
    npx prisma migrate deploy
    ```

    Índices que o Prisma não representa (como `pg_trgm`) precisam ser declarados no `schema.prisma` **e** no SQL, senão o `prisma migrate diff` vai propor removê-los.

- **Testes:** toda correção de bug deve vir com um teste que falharia antes dela.

## Cuidado com o `package-lock.json`

Existe um bug do npm ([npm/cli#4828](https://github.com/npm/cli/issues/4828)) em que `npm install` executado em uma plataforma **remove do lockfile as entradas dos pacotes opcionais das outras plataformas**. O sintoma é traiçoeiro: `npm ci` passa na sua máquina e falha no Linux (CI e build do Docker) com `Missing: @rolldown/binding-linux-x64-gnu@... from lock file`.

O lockfile deste repositório é mantido **completo** de propósito. Se você rodar `npm install` e o arquivo encolher (de ~228 KB para ~213 KB), regenere assim:

```bash
mkdir -p /tmp/lockgen && cp package.json /tmp/lockgen/
cd /tmp/lockgen && npm install --package-lock-only --ignore-scripts
cp package-lock.json /caminho/do/projeto/
```

Para conferir sem tocar em `node_modules`: `npm ci --dry-run` (precisa sair com código 0).

## Commits

Mensagens curtas no imperativo, em português ou inglês (mantenha a consistência do que já existe), com prefixo quando fizer sentido:

```
feat: adiciona filtro por Akuma no Mi
fix: corrige paginação além do fim da lista
docs: atualiza exemplos de resposta
test: cobre o limite de upload
```

## Reportando problemas

Ao abrir uma issue, inclua:

- o que você esperava e o que aconteceu;
- o comando ou a requisição que reproduz (com o corpo, sem o token);
- a versão do Node e o sistema operacional.

**Nunca** inclua o conteúdo do seu `.env` nem um token válido.
