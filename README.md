# LegalEasy

Projeto full-stack em Node.js/TypeScript com frontend Vite e backend Express + tRPC.

## Requisitos

- Node.js LTS (recomendado 20+)
- npm/pnpm (exemplos abaixo com npm)

## Instalação

```bash
npm install
```

Se estiver em Windows, instale o projeto em uma pasta local (ex.: `C:\Projetos\legaleasy`) para evitar erros de escrita em unidades sincronizadas.

## Variáveis de ambiente

Copie o `.env.example` para `.env` e preencha os valores necessários:

```powershell
Copy-Item .env.example .env
```

```bash
cp .env.example .env
```

Principais variáveis:

- `DATABASE_URL`: conexão do Drizzle (obrigatória para `npm run db:push`).
- `JWT_SECRET`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`: autenticação/OAuth.
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`: integrações do backend.
- `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`: variáveis expostas ao frontend.
- `VITE_API_URL`: alvo do proxy do Vite para `/api` (default `http://localhost:3000`).

## Desenvolvimento

### Windows (PowerShell)

```powershell
npm run dev
```

Isso inicia:
- Backend com `tsx watch` (porta padrão `3000`).
- Frontend Vite (porta padrão `5173`).

### macOS/Linux

```bash
npm run dev
```

### Scripts úteis

- `npm run dev:server` — backend em watch.
- `npm run dev:client` — Vite dev server.
- `npm run dev` — ambos em paralelo.

## Build e produção

```bash
npm run build
```

Isso gera:
- `dist/public` (frontend).
- `dist/index.js` (bundle do backend).

Para rodar em produção (Windows/macOS/Linux):

```bash
npm run start
```

## Banco de dados (Drizzle)

Para aplicar migrações/gerar schema:

```bash
npm run db:push
```

> Requer `DATABASE_URL` definido no `.env`.
