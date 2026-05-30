# 🚀 Deploy — Monorepo com Railway + Vercel

Um único repositório GitHub para backend e frontend.

---

## PASSO 1 — Subir no GitHub

```bash
cd campusflow360-monorepo

git init
git add .
git commit -m "feat: CampusFlow 360 - monorepo inicial"

# Crie um repositório no GitHub (ex: campusflow360) e conecte:
git remote add origin https://github.com/SEU_USUARIO/campusflow360.git
git push -u origin main
```

---

## PASSO 2 — Deploy do Backend no Railway

1. Acesse https://railway.app → **New Project** → **Deploy from GitHub repo**
2. Selecione o repositório `campusflow360`
3. ⚠️ **IMPORTANTE** — Antes de confirmar, clique em **"Configure"** e defina:
   - **Root Directory:** `backend`
4. Railway detecta o `nixpacks.toml` dentro de `backend/` e inicia o build

### Adicionar PostgreSQL
- No projeto Railway: **+ New** → **Database** → **PostgreSQL**
- As variáveis são injetadas automaticamente no serviço da API

### Variáveis de ambiente (Railway → seu serviço → Variables)
| Variável | Valor |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `FRONTEND_URL` | *(preencher depois com a URL do Vercel)* |

### Verificar
Após o build (~3 min), acesse:
`https://sua-api.up.railway.app/actuator/health` → `{"status":"UP"}`

---

## PASSO 3 — Deploy do Frontend no Vercel

1. Acesse https://vercel.com → **New Project** → importe `campusflow360`
2. ⚠️ **IMPORTANTE** — Em **"Root Directory"** clique em **Edit** e digite:
   - **Root Directory:** `frontend`
3. Em **Environment Variables**, adicione:
   | Variável | Valor |
   |----------|-------|
   | `VITE_API_URL` | `https://sua-api.up.railway.app` *(URL do Railway, sem `/` no final)* |
4. Clique em **Deploy**
5. Copie a URL gerada (ex: `https://campusflow360.vercel.app`)

---

## PASSO 4 — Conectar CORS

1. Volte ao Railway → **Variables**
2. Adicione/atualize: `FRONTEND_URL` = `https://campusflow360.vercel.app`
3. Clique em **Redeploy**

---

## Resultado final

| Serviço | URL |
|---------|-----|
| Frontend | `https://campusflow360.vercel.app` |
| API | `https://campusflow360-api.up.railway.app` |
| Swagger | `https://campusflow360-api.up.railway.app/swagger-ui.html` |
| Health | `https://campusflow360-api.up.railway.app/actuator/health` |

---

## Deploy automático (CI/CD)

Após configurar, **todo `git push` na branch `main`** dispara automaticamente:
- Railway → rebuild da API
- Vercel → rebuild do frontend

```bash
# Fazer uma alteração e subir
git add .
git commit -m "fix: corrige algum bug"
git push  # Railway e Vercel fazem deploy automaticamente
```

---

## Solução de problemas

**Railway: "No start command found"**
→ Verifique se o Root Directory está definido como `backend`

**Vercel: página em branco ou 404 nas rotas**
→ Verifique se o Root Directory está definido como `frontend`
→ O `vercel.json` dentro de `frontend/` já corrige rotas SPA

**CORS bloqueando requests**
→ `FRONTEND_URL` no Railway deve ser idêntico à URL do Vercel (sem `/` no final)
→ Após alterar, faça Redeploy no Railway

**Erro 500 no primeiro acesso**
→ Aguarde ~30s — o Spring está criando as tabelas no PostgreSQL com `ddl-auto: update`
→ Verifique logs: Railway → seu serviço → View Logs
