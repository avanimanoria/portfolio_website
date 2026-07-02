# Avani Manoria — Personal Portfolio (PRD)

## Original problem statement
Build a personal portfolio website with 3D interactive animation design elements for a techie
software developer / system design engineer / AI & automation specialist named **Avani Manoria**.
Rich, luxury, elegant, sophisticated color palette. Luxury elegant fonts. Logo of the name.

**Iteration 2**: Final-year engineering student positioning. Palette → onyx + midnight blue + sapphire + champagne gold. 3 real projects. Hidden admin panel + keyboard shortcut for self-editing. Elegant fonts with Italian-italic accents.

## Architecture
- **Frontend**: React 19 + CRA, TailwindCSS, framer-motion, lenis, sonner, axios.
- **3D**: three@0.171 + @react-three/fiber@9.1.2 + @react-three/drei@10.7.7 (gold torus knot with sapphire + gold dual lighting).
- **Backend**: FastAPI + Motor + MongoDB. All routes prefixed `/api`. JWT (bcrypt + PyJWT).
- **Auth**: single-admin JWT, seeded from `.env` on startup (idempotent). 5-attempt brute-force lockout for 15 min.
- **Collections**: `users`, `settings`, `projects`, `education`, `contact_messages`, `login_attempts`.

## Design system
- Palette: `#050505` onyx · `#0B1E3F` midnight · `#0F52BA` sapphire · `#D4AF37` champagne gold · `#F2DDB6` gold-soft · `#F2F2F2` ivory.
- Fonts: **Cormorant Garamond** (display, heavy italic use), **La Belle Aurore** (signature script), **Outfit** (body), **JetBrains Mono** (accents).
- Section eyebrows use Italian words: *Piccola introduzione · Filosofia · Percorso · Corrispondenza · Con cura*.
- Signature "Avani" script appears in Education section footer and Footer.

## Sections (public site `/`)
1. Hero — dual-lit 3D torus knot, meta strip with "Final Year · Engineering".
2. Marquee — italic serif ticker.
3. About — bio + philosophy card with sapphire + gold blooms.
4. Skills — 4 disciplines (Software, System Design, Applied AI, Automation).
5. Projects — dynamic from `/api/projects` (Activity Points MS, Customer Churn ML, Vellum AI concept).
6. Education / Journey — dynamic from `/api/education`, ends with a script "Avani" signature.
7. Contact — glass form (POST /api/contact) with dynamic email + socials.
8. Footer — dynamic socials, signature.

## Hidden admin (`/atelier`)
- Access: (a) direct URL `/atelier`, (b) global keyboard shortcut `Ctrl / ⌘ + Shift + A` anywhere on the site.
- No link is visible from the public site.
- Tabs:
  - **Profile & Bio** — name, tagline, bios, philosophy quote, contact email, availability, hero meta, socials (LinkedIn, GitHub, Twitter, Writing).
  - **Projects** — CRUD with inline editing (kind, year, title, blurb, stack, image_url, github_url, live_url, order).
  - **Education** — CRUD (period, degree, institution, notes, order).
  - **Messages** — inbox for contact submissions with reply-by-email deep link + delete.
  - **Settings** — access info + how to change password.

## Backend endpoints
- `POST /api/auth/login` · `GET /api/auth/me`
- `GET /api/profile/settings` · `PATCH /api/profile/settings` *(auth)*
- `GET/POST/PATCH/DELETE /api/projects[/:id]` *(mutations require auth)*
- `GET/POST/PATCH/DELETE /api/education[/:id]` *(mutations require auth)*
- `POST /api/contact` · `GET/DELETE /api/admin/messages[/:id]` *(admin only)*

## Admin credentials
- Email: `avanimanoria@gmail.com`
- Password: `Atelier@Avani2026` *(editable via `ADMIN_PASSWORD` in `/app/backend/.env`, auto-refreshed on restart)*

## What's implemented (2026-07-02)
- Full public site with 3D, dynamic content pulled from API.
- Full admin CMS (Atelier) with 5 tabs, CRUD across profile/projects/education/messages.
- Hidden entry: keyboard shortcut + direct URL, invisible to visitors.
- Auth: JWT + bcrypt + brute-force lockout, admin auto-seeded.
- Testing: 17/17 backend pytest, 100% frontend flows.

## Backlog (P0 → P2)
- **P1** — Email notifications on new contact submission (Resend/SendGrid).
- **P1** — Rich text / markdown editor for bio & project blurbs.
- **P1** — Image upload for project thumbnails (currently URL-based).
- **P1** — Change-password UI inside Atelier (currently env-driven).
- **P2** — Case-study detail pages per project.
- **P2** — Resume PDF upload + download button on hero.
- **P2** — Public "achievements" section (hackathons, certifications, awards) sourced from Atelier.
- **P2** — Migrate `@app.on_event` to lifespan handlers.
- **P2** — Restrict CORS origins for prod; migrate JWT to httpOnly cookies.
- **P2** — Add "reveal on scroll" animations and a custom cursor.

## Personas
- **Recruiters / hiring managers** — need signal of taste, technical depth, and ownership.
- **Fellow students / collaborators** — checking out projects and reaching out.
- **Herself (Avani)** — updates content via the private atelier as she progresses through final year.

## Next tasks
1. Add real socials, resume PDF, and refined project descriptions via Atelier.
2. (Optional) Email notifications for new contact submissions.
3. (Optional) Move password change into the Atelier UI so `.env` edits are not needed.
