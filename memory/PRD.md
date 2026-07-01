# Avani Manoria — Personal Portfolio (PRD)

## Original problem statement
Build a personal portfolio website with 3D interactive animation design elements for a techie
software developer / system design engineer / AI & automation specialist named **Avani Manoria**.
Rich, luxury, elegant, sophisticated color palette. Luxury elegant fonts. Logo of the name.

## Architecture
- **Frontend**: React 19 + CRA, TailwindCSS, framer-motion, lenis (smooth scroll), sonner (toasts).
- **3D**: three@0.171, @react-three/fiber@9.1.2, @react-three/drei@10.7.7 (MeshTransmissionMaterial gold torus knot + inner metal icosahedron + sparkles + stars + environment).
- **Backend**: FastAPI + Motor + MongoDB. All routes prefixed `/api`.
- **Persistence**: `contact_messages` MongoDB collection (id, name, email, subject?, message, created_at).

## Design system
- Palette: `#050505` obsidian, `#D4AF37` champagne gold, `#F2DDB6` gold-soft, `#E5E4E2` platinum, `#F2F2F2` ivory.
- Fonts: **Cormorant Garamond** (display), **Outfit** (body), **JetBrains Mono** (accents).
- Logo: bespoke "AM" monogram inside a hairline gold ring, paired with "Avani *Manoria*" wordmark and a mono tag "Software · Systems · AI".
- Motion: staggered fade-ups, smooth Lenis momentum scroll, subtle floating on the hero mesh, mouse-following point light.

## Sections implemented
1. **Hero** — 3D animated gold knot + inner icosahedron core, headline with italic gold-gradient surname, meta strip.
2. **Marquee** — italic serif ticker with luxury discipline keywords.
3. **About** — bio + philosophy glass card with "Craft / Restraint / Curiosity" pillars.
4. **Skills** — 4 discipline cards (Software Eng, System Design, Applied AI, Automation).
5. **Projects** — 4 selected works (Aurum, Meridian, Loom, Cortex) with images, stack pills, case-study CTA.
6. **Experience** — vertical gold timeline (2018 → present).
7. **Contact** — glass form (POST /api/contact) + direct email + socials.
8. **Footer** — logo, nav, elsewhere, © line.

## Backend endpoints
- `GET  /api/` — health/root.
- `POST /api/contact` — create contact message (validates email).
- `GET  /api/contact/messages` — list messages, newest first.
- Legacy `/api/status` GET/POST retained.

## What's been implemented (as of 2026-07-01)
- Full single-page luxury portfolio, live at `/`.
- 3D interactive hero (react-three-fiber v9) with mouse-tracking point light.
- Contact form → MongoDB (verified end-to-end).
- Backend pytest suite: 7/7 passing. Frontend Playwright: all flows passing.
- Data-testids on every interactive element.

## Backlog (P0 → P2)
- **P1** — Real content: bio, project case studies, actual social links, resume PDF download.
- **P1** — Email delivery of contact submissions (Resend or SendGrid) so Avani gets notified.
- **P2** — Case-study detail routes (`/work/aurum`, etc.).
- **P2** — Blog / notes section.
- **P2** — Analytics dashboard for contact submissions.
- **P2** — Optional light-mode toggle (currently dark-only, intentional).
- **P2** — Custom animated cursor + reveal-on-scroll variants.

## Personas
- **Recruiters / hiring managers** — need a quick, credible signal of taste & seniority.
- **Startup founders / CTOs** — evaluating for advisory / contract engagements.
- **Peers / collaborators** — checking recent work and reaching out.

## Next tasks
1. Swap placeholder copy for Avani's real bio, projects, experience.
2. Add real social handles + resume link.
3. Integrate email notification on new contact submission.
