# LegalEasy

## Requirements

- Node.js LTS (18+ recommended)
- npm (ships with Node.js)
- MySQL-compatible database for Drizzle (optional for local UI work)

## Setup (Windows PowerShell)

```powershell
# From the repo root
npm install

# Copy environment template
Copy-Item .env.example .env
```

## Commands

```powershell
# Run backend + frontend (API on :3000, Vite on :5173)
npm run dev

# Build client + server
npm run build

# Run production build
npm run start

# Type-check
npm run check

# Format
npm run format

# Run tests
npm run test

# Run Drizzle migrations (requires DATABASE_URL)
npm run db:push
```

## Environment Variables

Create a `.env` file based on `.env.example` and fill in the values you need.

```env
PORT=3000
NODE_ENV=development

VITE_APP_ID=
JWT_SECRET=
OAUTH_SERVER_URL=
OWNER_OPEN_ID=
DATABASE_URL=mysql://user:password@localhost:3306/legaleasy
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
```

## Notes

- The backend listens on `http://localhost:3000` by default.
- The Vite dev server runs on `http://localhost:5173` and proxies `/api` to the backend.
- When `npm run dev` is used, the backend skips its embedded Vite middleware because `VITE_DEV_SERVER_URL` is set for the process.
