# Scalable Web Application with Authentication & Dashboard

Production-ready Next.js 16 dashboard with JWT auth, Prisma-backed CRUD, and a clean responsive UI. Ship fast, stay secure.

## Example `.env.local`

```env
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Highlights

- JWT auth with middleware-protected routes and cookies
- Prisma entities CRUD with filters, modals, and toast feedback
- Tailwind CSS 4 design system + shared card/background variables
- Rate-limited API endpoints and Zod validation end-to-end
- Accessible UI (keyboard friendly, ARIA labels, screen readers)

## Quick Start

```bash
git clone <repo>
cd primetrade_assignment
npm install
cp .env.example .env.local   # or use the snippet above
npx prisma db push           # seed SQLite quick start
npm run dev
```

### Optional: Vercel Postgres
- Update `DATABASE_URL` + `DIRECT_URL`
- `npx prisma migrate dev --name init`

## Project Structure

```
primetrade_assignment/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── user/              # User profile endpoints
│   │   └── entities/          # CRUD endpoints
│   ├── login/                 # Login page
│   ├── register/              # Register page
│   ├── dashboard/             # Protected dashboard
│   └── layout.tsx             # Root layout
├── components/
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── auth.ts                # Authentication utilities
│   ├── prisma.ts              # Prisma client
│   ├── rate-limit.ts          # Rate limiting utilities
│   └── validations.ts         # Zod schemas
├── types/
│   └── index.ts               # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database
└── middleware.ts              # Route protection
```


## API Snapshot

| Method | Endpoint           | Notes                  |
| ------ | ----------------- | ---------------------- |
| POST   | /api/auth/register | Create account         |
| POST   | /api/auth/login    | Issue JWT + cookie     |
| GET    | /api/user/profile  | Requires auth header   |
| CRUD   | /api/entities[/id] | Filter + manage items  |

## Dev Scripts

```bash
npm run dev
npm run build
npm start
```

## License

This project is part of a technical assignment.

