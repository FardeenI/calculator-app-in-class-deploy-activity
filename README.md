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
