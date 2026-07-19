# Avani Manoria — Portfolio

A luxury, 3D-interactive personal portfolio for a final-year engineering student working across **full-stack software, machine learning, and applied AI**.

**Live:** https://tech-elite-showcase.emergent.host

![Made with](https://img.shields.io/badge/stack-React%20%C2%B7%20FastAPI%20%C2%B7%20MongoDB-D4AF37)
![Auth](https://img.shields.io/badge/auth-JWT%20%2B%20bcrypt-0F52BA)

---

## ✨ Overview

An elegant, dark-themed portfolio with an immersive 3D hero, smooth scroll motion, a custom cursor, and a **hidden admin panel** that lets the owner edit everything (bio, projects, education, socials, inbox) without touching code.

- **Palette:** Onyx · Midnight Blue · Sapphire · Champagne Gold
- **Fonts:** Cormorant Garamond (display) · Outfit (body) · JetBrains Mono (accents) · La Belle Aurore (signature)

---

## 🎯 Features

- **3D interactive hero** — a wireframe gold icosahedron with a sapphire orbit ring, floating particles, and mouse-driven parallax (`react-three-fiber` + `drei`).
- **Scroll motion & custom cursor** — parallax fades on scroll (`framer-motion` + `lenis`) and a gold trailing cursor.
- **Dynamic content** — bio, projects, education, and socials are all served from the API and editable at runtime.
- **Project showcase** — click any project to open a modal with a **demo video** (YouTube / Vimeo / MP4) and **GitHub** link.
- **Contact form** — messages are stored in MongoDB and readable from the admin inbox.
- **Hidden admin ("Atelier")** — reachable at `/atelier` or via the secret shortcut **`Ctrl + Shift + Alt + Z` then `S`**. Full CRUD for profile, projects, education, and messages, plus file uploads.
- **Security** — JWT auth, bcrypt password hashing, brute-force lockout (5 attempts → 15 min).

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS, framer-motion, react-three-fiber, drei, lenis, sonner |
| Backend | FastAPI, Motor (async MongoDB), PyJWT, bcrypt |
| Database | MongoDB |
| Tooling | CRACO, Yarn |

---

## 📂 Project Structure

```
.
├── backend/
│   ├── server.py          # FastAPI app — auth, content CRUD, uploads, contact
│   ├── requirements.txt
│   └── .env               # MONGO_URL, DB_NAME, JWT_SECRET, ADMIN_* (not committed)
└── frontend/
    ├── src/
    │   ├── pages/         # Portfolio, Atelier (admin)
    │   ├── components/portfolio/   # Hero, Scene3D, Projects, Contact, ...
    │   ├── contexts/AuthContext.jsx
    │   └── lib/api.js
    ├── package.json
    └── .env               # REACT_APP_BACKEND_URL
```

---

## 🚀 Getting Started

### Prerequisites
- Node 20+, Yarn, Python 3.11+, MongoDB

### Backend
```bash
cd backend
pip install -r requirements.txt
# create .env (see below), then:
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install
yarn start        # http://localhost:3000
```

### Environment Variables

**backend/.env**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="portfolio"
CORS_ORIGINS="*"
JWT_SECRET="<a-long-random-secret>"
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="<your-admin-password>"
```

**frontend/.env**
```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

> The admin user is seeded automatically on first startup. Changing `ADMIN_PASSWORD` and restarting the backend refreshes the stored hash.

---

## 🔌 API Reference (prefix: `/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | – | Login, returns JWT |
| GET | `/auth/me` | ✅ | Current admin |
| GET | `/profile/settings` | – | Public profile/bio/socials |
| PATCH | `/profile/settings` | ✅ | Update profile |
| GET | `/projects` | – | List projects |
| POST · PATCH · DELETE | `/projects[/:id]` | ✅ | Manage projects |
| GET | `/education` | – | List education entries |
| POST · PATCH · DELETE | `/education[/:id]` | ✅ | Manage education |
| POST | `/contact` | – | Submit a message |
| GET · DELETE | `/admin/messages[/:id]` | ✅ | Read / delete messages |
| POST | `/admin/upload` | ✅ | Upload image/video |

---

## 🔐 Admin Panel (Atelier)

- **URL:** `/atelier`
- **Shortcut:** hold `Ctrl + Shift + Alt + Z`, then press `S`
- Edit profile, projects (with demo video + GitHub links), education, and view the contact inbox.

> For a deployed site, prefer pasting **hosted media URLs** (YouTube, Vimeo, Cloudinary, direct MP4) over uploading, since local uploads are ephemeral across redeploys.

---

## 📄 License

Personal project © Avani Manoria. All rights reserved.
