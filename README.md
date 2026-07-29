# InterPayments — Frontend Skills Assessment

A small transactions dashboard: a React + Vite frontend backed by an Express API
that serves a list of payment transactions.

> Candidates: start with **[INSTRUCTIONS.md](./INSTRUCTIONS.md)**.

## Layout

```
apps/
  api/   Express + TypeScript API (transactions, summary)
  web/   React + Vite + TypeScript dashboard
```

## Prerequisites

- Node.js 20+ (a `.nvmrc` pins 22)

## Getting started

```bash
npm install     # installs both workspaces
npm run dev     # starts the API and the web app together
```

- Web app: http://localhost:3000
- API: http://localhost:4000 (the web dev server proxies `/api` to it)

## Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Run the API and web app concurrently |
| `npm run build` | Type-check and build the web app |
| `npm run lint` | Lint all workspace source |
| `npm test` | Run workspace tests (if any) |
