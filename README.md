# Simple Calculator App

Run locally:

1. Install deps:

```bash
cd deployment/calculator-app
npm install
```

2. Start server:

```bash
npm start
```

Open http://localhost:3000

Frontend shows a simple calculator. The backend exposes POST `/calculate` with JSON `{ expression: string }` and returns `{ result: string }`.

Refactored layout:

- `backend/` — Node backend exposing POST `/calculate` on port `3001` (CORS enabled).
- `frontend/` — Node frontend serving static files on port `3000` (serves `frontend/public`).

Run locally (two terminals):

```bash
cd deployment/calculator-app/backend
npm install
npm start
```

```bash
cd deployment/calculator-app/frontend
npm install
npm start
```

Open http://localhost:3000 (frontend). The frontend calls the backend at http://localhost:3001/calculate.
