# TZW Fire Extinguisher Management System

A full-stack Fire Extinguisher Management System for TZW LTD, built on a RESTful,
microservice-oriented architecture. It lets users check extinguisher statuses, schedule
inspections, log maintenance actions, manage compliance, and generate real-time reports.

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Swagger/OpenAPI docs
- **Frontend:** React (Vite), React Router, Axios
- **Design docs:** [`DESIGN.md`](./DESIGN.md) (architecture + DB model) · [`MOCKUP.md`](./MOCKUP.md) (signup mockup)
- **Figma mockup (registration form):** https://www.figma.com/design/Yiqoh5c9yeg6FRDWKMkXnn/Untitled?node-id=0-1

---

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Backend
```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000
```
API docs (Swagger UI): **http://localhost:5000/api-docs**

Configuration lives in `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tzw_fire_db
JWT_SECRET=...
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
# SMTP_* — leave blank to log emails to the console in development
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

> **Email note:** If `SMTP_*` is not configured, password-reset and inspection-notification
> emails are printed to the **backend console** instead of being sent — copy the reset link
> from there to test the flow without a mail server.

---

## Live deployment

| Layer | Platform | URL |
|-------|----------|-----|
| Frontend | Vercel | _add link after deploy_ |
| Backend API | Render | _add link after deploy_ |
| API docs (Swagger) | Render | _backend-url_/api-docs |
| Database | MongoDB Atlas | (managed) |

### Deployment steps

**1. MongoDB Atlas**
1. Create a free cluster at https://cloud.mongodb.com
2. Database Access → add a user; Network Access → allow `0.0.0.0/0`
3. Connect → Drivers → copy the connection string into `MONGO_URI`

**2. Backend on Render**
1. New → Web Service → connect this GitHub repo
2. **Root Directory:** `backend`
3. **Build Command:** `npm install` · **Start Command:** `npm start`
4. Add environment variables (see `backend/.env.example`): `MONGO_URI`, `JWT_SECRET`,
   `JWT_EXPIRES_IN`, `NODE_ENV=production`, `FRONTEND_URL`, `API_URL`
5. Deploy → note the URL (e.g. `https://tzw-backend.onrender.com`)

**3. Frontend on Vercel**
1. Add New → Project → import this GitHub repo
2. **Root Directory:** `frontend` (framework auto-detected as Vite)
3. Add environment variable: `VITE_API_URL = https://<your-render-backend>/api`
4. Deploy → note the URL, then set it as `FRONTEND_URL` on Render and redeploy the backend

> After both are live, the frontend talks to the backend via `VITE_API_URL`, the backend
> allows the frontend origin via `FRONTEND_URL`, and both share the Atlas database.

## Requirements coverage

### Activity 1 — Requirement Analysis & Design
- ✅ Microservices identified & defined → [`DESIGN.md`](./DESIGN.md)
- ✅ RESTful API contract via OpenAPI/Swagger → `/api-docs`
- ✅ Database model / ERD → [`DESIGN.md`](./DESIGN.md)
- ✅ Registration form mockup → [`MOCKUP.md`](./MOCKUP.md)

### Activity 2 — User Management
- ✅ Roles: Admin, Inspector, User
- ✅ Registration endpoint (first name, last name, email, password)
- ✅ JWT authentication + role-based authorization, login & logout
- ✅ Profile management: update profile, change password, recover password (token-based)

### Activity 3 — Fire Extinguisher Management
- ✅ Register extinguisher (serial, location, type, size, install date, expiry, status)
- ✅ List all · view by ID · update · remove
- ✅ Schedule inspections (select extinguisher, date/time) + notify the assigned inspector by email
- ✅ Log maintenance (action taken, date, conditions noted)

### Activity 4 — Reporting
- ✅ Real-time reports: extinguisher stock (daily / monthly / yearly), status breakdown,
  inspection status, maintenance activity

---

## Roles & permissions

| Action | Admin | Inspector | User |
|--------|:-----:|:---------:|:----:|
| Register / login | ✓ | ✓ | ✓ |
| View extinguishers | ✓ | ✓ | ✓ |
| Create / update extinguisher | ✓ | ✓ | — |
| Delete extinguisher | ✓ | — | — |
| Schedule inspection | ✓ | ✓ | ✓ |
| Log maintenance | ✓ | ✓ | — |
| View reports | ✓ | — | — |

---

## Project structure
```
backend/
  server.js                 # app entry, wires routes (API gateway role)
  src/
    config/                 # db + swagger config
    controllers/            # business logic per service
    middleware/auth.js      # JWT protect + role guard
    models/                 # Mongoose schemas
    routes/                 # REST routes + Swagger annotations
    utils/sendEmail.js      # notification service (SMTP / console)
frontend/
  src/
    api/axios.js            # API client with JWT interceptor
    context/AuthContext.jsx # auth state
    components/             # Navbar, PrivateRoute
    pages/                  # Login, Register, ForgotPassword, ResetPassword,
                            # Dashboard, Extinguishers, Inspections, Maintenance,
                            # Reports, Profile
```
