Interactive Product Tour Platform (Marvedge Task)

Full-stack app to create and share interactive product tours.

Tech
- Frontend: Next.js (TS), Tailwind, Framer Motion
- Backend: Express (TS), Prisma, SQLite (dev) / Postgres (prod)

Local Dev
1. Backend
   - cd backend
   - Ensure `.env` contains:
     - DATABASE_URL=file:./dev.db
     - JWT_SECRET=dev-secret
     - PORT=4000
   - Run: `npm run dev`
2. Frontend
   - cd frontend
   - Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:4000`
   - Run: `npm run dev`

Deploy
- Backend: Render (see backend/render.yaml). Set env vars. Use Postgres ideally.
- Frontend: Vercel. Set `NEXT_PUBLIC_API_URL` to backend URL.

Features
- Auth (signup/login, JWT)
- Tours CRUD, steps with images/videos and text
- Uploads (images, screen recordings)
- Public share page `/p/[shareId]`
- Dashboard with mocked analytics

Demo Script
1) Sign up, 2) Create tour, 3) Upload image or record screen, 4) Save, 5) Copy public link and open.

