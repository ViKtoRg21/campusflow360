# CampusFlow 360 — Monorepo

```
campusflow360/
├── backend/    → API Java 17 + Spring Boot 3 (deploy: Railway)
└── frontend/   → React + Vite + Tailwind (deploy: Vercel)
```

## Rodar localmente

```bash
# Terminal 1 — Backend
cd backend
mvn spring-boot:run

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:3000
