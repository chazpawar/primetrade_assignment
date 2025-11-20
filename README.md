# Scalable Web Application with Authentication & Dashboard

A modern, production-ready web application built with Next.js 16, featuring secure authentication, CRUD operations, and a responsive dashboard.

## Features

### Authentication System
- Secure user registration with password hashing (bcrypt)
- JWT-based authentication with `jose`
- Protected routes using Next.js middleware
- Session management with cookies
- Password strength indicator
- Form validation with Zod

### Dashboard Functionality
- User profile display with data from backend
- Complete CRUD operations for entities
- Search and filter capabilities
- Responsive design (mobile, tablet, desktop)
- Toast notifications for user feedback
- Modal dialogs for confirmations
- Loading states for async operations

### Security Features
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication
- Rate limiting on API endpoints (prevents abuse)
- Environment variables for secrets
- Input validation on both client and server
- Protected API routes
- CSRF protection via token validation

### Accessibility Features
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatible
- Focus management in modals
- High contrast support

### Database
- Prisma ORM for type-safe database access
- PostgreSQL for production (Vercel Postgres)
- SQLite for local development (optional)
- Automatic schema migrations
- Indexed queries for performance

## Tech Stack

- **Framework:** Next.js 16.0.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** Prisma with PostgreSQL
- **Authentication:** JWT with `jose`
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **Form Management:** React Hook Form
- **Icons:** Lucide React
- **Deployment:** Vercel + Vercel Postgres

## Deployment

**Ready to deploy to production?** 

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions**

Quick summary:
1. Create Vercel account and project
2. Set up Vercel Postgres database
3. Configure environment variables
4. Deploy via Vercel Dashboard or CLI
5. Test your production application

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd primetrade_assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   
   For local development with SQLite (quick start):
   ```env
   DATABASE_URL="file:./dev.db"
   DIRECT_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
   
   For local development with Vercel Postgres (recommended):
   ```env
   # Get these from Vercel Storage → Your Database → .env.local tab
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   JWT_SECRET="your-super-secret-jwt-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   
   For SQLite:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   
   For PostgreSQL:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Routes (require JWT token)
- `GET /api/user/profile` - Get user profile
- `GET /api/entities` - List all entities (with filters)
- `POST /api/entities` - Create entity
- `GET /api/entities/[id]` - Get single entity
- `PUT /api/entities/[id]` - Update entity
- `DELETE /api/entities/[id]` - Delete entity

## Development Scripts

```bash
npm run dev      # Run development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## Database Schema

### User Model
- id, email (unique), name, password (hashed)
- Timestamps: createdAt, updatedAt

### Entity Model
- id, title, description, category, status, priority
- Foreign key: userId
- Timestamps: createdAt, updatedAt

## Security Best Practices

1. **Password Security** - Bcrypt hashing, strong password requirements
2. **JWT Tokens** - 7-day expiration, HTTP-only cookies
3. **Input Validation** - Zod schemas on client and server
4. **API Protection** - Middleware authentication, resource verification
5. **Rate Limiting** - Token bucket algorithm prevents abuse
   - Auth endpoints: 5 requests, refill 1 every 10 seconds
   - API endpoints: 30 requests, refill 1 per second
6. **Comprehensive JSDoc** - All utility functions documented
7. **Accessibility** - ARIA labels, keyboard navigation, screen reader support

## License

This project is part of a technical assignment.

