# Legaleasy

## Visão geral
Projeto full-stack com **backend em Node/TypeScript** (Express + tRPC) e **frontend em Vite/React**.

Estrutura principal:
- `server/`: backend (entrypoint em `server/_core/index.ts`).
- `client/`: frontend Vite.
- `drizzle/`: schema/migrations do Drizzle.

## Requisitos
- **Node.js LTS** (recomendado 20.x ou superior).
- npm (ou pnpm/yarn). Exemplos abaixo usam npm.

## Configuração de ambiente
Crie um arquivo `.env` na raiz com base em `.env.example`.

Variáveis principais:
- `DATABASE_URL`: string de conexão (MySQL) para o Drizzle.
- `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`: necessários para OAuth no frontend.
- `JWT_SECRET`: segredo para cookies/tokens no backend.
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`: integração de APIs externas.

> **Importante:** `.env` não deve ser commitado.

## Instalação
No diretório do projeto:

```bash
npm install
```

Se houver conflitos de peer deps no seu ambiente, use:

```bash
npm install --legacy-peer-deps
```

## Desenvolvimento (Windows / PowerShell)
Executa backend em watch mode + Vite no frontend:

```powershell
npm run dev
```

Isso inicia:
- Backend: `http://localhost:3000`
- Frontend (Vite): `http://localhost:5173`

## Desenvolvimento (macOS/Linux)

```bash
npm run dev
```

## Build
Gera o build do client e o bundle do server em `dist/`:

```bash
npm run build
```

## Start (produção, Windows/macOS/Linux)
Após o build, inicia o servidor em modo produção:

```bash
npm run start
```

O servidor usa `dist/public` para servir o frontend.

## Banco de dados (Drizzle)
Se estiver usando banco local ou remoto, configure `DATABASE_URL` e rode:

```bash
npm run db:push
```

## Scripts disponíveis
- `npm run dev:server`: backend em watch (TSX) no modo desenvolvimento.
- `npm run dev:client`: Vite dev server.
- `npm run dev`: executa ambos em paralelo.
- `npm run build`: build do client + bundle do server.
- `npm run start`: start do server em produção.
- `npm run check`: TypeScript sem emitir.
- `npm run test`: roda o Vitest.

## Notas
- O Vite possui proxy para `/api` apontando para `http://localhost:3000`.
- Para trocar a porta do backend, ajuste `PORT` no `.env` e também no proxy do Vite (`vite.config.ts`).
