# Avani Manoria — Portfolio

A luxury, 3D-interactive personal portfolio for a final-year engineering student working across **full-stack software, machine learning, and applied AI**.

**Live:** https://tech-elite-showcase.emergent.host

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
- **Hidden admin ("Atelier")** — reachable at `/atelier` or via the secret shortcut. Full CRUD for profile, projects, education, and messages, plus file uploads.

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
│   ├── server.py         
│   ├── requirements.txt
│   └── .env               
└── frontend/
    ├── src/
    │   ├── pages/        
    │   ├── components/portfolio/   
    │   ├── contexts/AuthContext.jsx
    │   └── lib/api.js
    ├── package.json
    └── .env               
```

---

## 📄 License

Personal project © Avani Manoria. All rights reserved.
