# Deployment Guide: Vercel + Vercel Postgres

This guide walks you through deploying your application to Vercel with Vercel Postgres database.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)
- Node.js 18+ installed locally

---

## Part 1: Set Up Vercel Postgres Database

### Step 1: Create Vercel Account & Import Project

1. Go to **https://vercel.com** and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. **DO NOT DEPLOY YET** - we need to set up the database first

### Step 2: Create Vercel Postgres Database

1. In Vercel Dashboard, go to the **Storage** tab (top navigation)
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Configure:
   - **Name**: `primetrade-db` (or any name you prefer)
   - **Region**: Choose closest to your target users
   - **Plan**: Hobby (Free) - 256 MB, 60 hours compute/month
5. Click **"Create"**
6. Wait for database provisioning (takes ~30 seconds)

### Step 3: Get Database Connection Strings

1. After creation, click on your database name
2. Go to **".env.local"** tab or **"Quickstart"** tab
3. You'll see multiple connection strings:

```env
POSTGRES_URL="postgres://default:***@***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:***@***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:***@***-prod.us-east-1.postgres.vercel-storage.com:5432/verceldb"
```

**Important**: Keep this tab open, you'll need these values!

### Step 4: Connect Database to Your Project

1. In Vercel Dashboard, go to your **Project**
2. Go to **Settings** → **Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development**:

#### Required Variables:

**Database URLs** (from Step 3):
```
DATABASE_URL = <paste POSTGRES_PRISMA_URL value>
DIRECT_URL = <paste POSTGRES_URL_NON_POOLING value>
```

**JWT Secret** (generate new one):
```bash
# Run this command to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
```
JWT_SECRET = <paste generated secret>
```

**Application URL**:
```
NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
```

**Node Environment**:
```
NODE_ENV = production
```

**IMPORTANT**: 
- Click "Add" for each variable
- Select all environments (Production, Preview, Development)
- Click "Save" after adding all variables

---

## Part 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to your project in Vercel Dashboard
2. Go to **Deployments** tab
3. Click **"Create Deployment"**
4. Watch the deployment logs:
   - ✅ Installing dependencies
   - ✅ Running `prisma generate`
   - ✅ Running `prisma migrate deploy`
   - ✅ Building Next.js application
5. Wait for "Building Complete" message
6. Your app URL: `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link your project (first time only)
vercel link

# 4. Pull environment variables (optional, for local testing)
vercel env pull

# 5. Deploy to production
vercel --prod
```

---

## Part 3: Test Your Deployment

### Step 1: Verify Database Schema

1. Go to **Storage** → Your Database → **Data** tab
2. You should see two tables:
   - `User`
   - `Entity`

### Step 2: Test API Endpoints

**Test Registration:**
```bash
curl -X POST https://your-project-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Test Login:**
```bash
curl -X POST https://your-project-name.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  },
  "message": "Login successful"
}
```

### Step 3: Test Frontend

1. Visit `https://your-project-name.vercel.app`
2. Click **"Register"** → Create new account
3. Login with credentials
4. Test dashboard features:
   - Create entity
   - View entities
   - Edit entity
   - Delete entity
   - Search/filter

---

## Part 4: Local Development with Production Database (Optional)

If you want to test locally with the production database:

### Step 1: Get Environment Variables

```bash
# Pull environment variables from Vercel
vercel env pull .env.local
```

Or manually create `.env.local`:

```env
# Copy from Vercel Storage → Database → .env.local tab
DATABASE_URL="postgresql://default:***@***.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://default:***@***.vercel-storage.com:5432/verceldb"
JWT_SECRET="your-secret-from-vercel"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 2: Generate Prisma Client & Run Dev Server

```bash
# Generate Prisma Client
npx prisma generate

# Run development server
npm run dev
```

**Note**: This connects to your production database. Be careful not to corrupt production data!

---

## Part 5: Custom Domain (Optional)

### Step 1: Add Domain in Vercel

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `yourdomain.com`
4. Vercel provides DNS records to add

### Step 2: Configure DNS

Add these records in your domain registrar:

**For Apex Domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Update Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL`:
   ```
   NEXT_PUBLIC_APP_URL = https://yourdomain.com
   ```
3. Redeploy to apply changes

---

## Part 6: Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] User registration working
- [ ] User login working
- [ ] JWT tokens being issued
- [ ] Protected routes accessible with token
- [ ] CRUD operations working (Create, Read, Update, Delete)
- [ ] Search functionality working
- [ ] Filter functionality working
- [ ] User profile showing entity count
- [ ] All API endpoints returning correct responses
- [ ] Frontend pages loading correctly
- [ ] No errors in Vercel deployment logs

---

## Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
- Verify `DATABASE_URL` and `DIRECT_URL` are set in Environment Variables
- Check that you're using `POSTGRES_PRISMA_URL` for `DATABASE_URL`
- Ensure database is in same or nearby region as deployment

### Issue: "Prisma Client not generated"

**Solution:**
- Check that `postinstall` script is in `package.json`:
  ```json
  "postinstall": "prisma generate"
  ```
- Redeploy to trigger fresh install

### Issue: "Migration failed"

**Solution:**
- Go to Vercel project → **Settings** → **Functions**
- Check build logs for specific error
- Manually run migrations via CLI:
  ```bash
  vercel env pull
  npx prisma migrate deploy
  ```

### Issue: Build timeout

**Solution:**
- Upgrade Vercel plan (Hobby has 45s build limit, Pro has 15min)
- Or simplify build command:
  ```json
  "build": "prisma generate && next build"
  ```
- Run migrations separately after deployment

### Issue: "Environment variable not found"

**Solution:**
- Ensure variables are set for correct environment (Production/Preview/Development)
- After adding variables, trigger new deployment
- Use `vercel env pull` to verify locally

### Issue: Rate limiting not working across serverless functions

**Current Status:**
- In-memory rate limiting works within single function invocation
- For production, consider:
  - **Vercel KV** (Redis): https://vercel.com/docs/storage/vercel-kv
  - **Upstash Redis**: https://upstash.com
  - Remove rate limiting temporarily

---

## Database Management

### View Database in Prisma Studio

```bash
# Pull environment variables
vercel env pull

# Open Prisma Studio
npx prisma studio
```

### View Database in Vercel Dashboard

1. Go to **Storage** → Your Database
2. Click **Data** tab
3. Browse tables and run queries

### Run Custom SQL Queries

1. Go to **Storage** → Your Database
2. Click **Query** tab
3. Write SQL:
   ```sql
   SELECT * FROM "User";
   SELECT * FROM "Entity" WHERE "userId" = 'some-user-id';
   ```

### Backup Database

Vercel Postgres includes automatic backups:
- Go to **Storage** → Your Database → **Backups** tab
- Point-in-time recovery available
- Manual backups can be created

---

## Monitoring & Logs

### View Deployment Logs

1. Go to **Deployments** tab
2. Click on deployment
3. View **Build Logs** and **Function Logs**

### View Runtime Logs

1. Go to project overview
2. Click **Logs** or **Monitoring** tab (Pro plan)
3. Filter by function, status code, or time range

### Set Up Alerts (Pro Plan)

1. Go to **Settings** → **Notifications**
2. Configure alerts for:
   - Deployment failures
   - Runtime errors
   - Performance issues

---

## Scaling Considerations

### Free Tier Limits (Hobby Plan)

- **Bandwidth**: 100 GB/month
- **Function Executions**: 100k/month
- **Postgres Storage**: 256 MB
- **Postgres Compute**: 60 hours/month
- **Build Time**: 45 seconds max

### When to Upgrade

Upgrade to **Pro Plan** ($20/month) when:
- Exceeding bandwidth or function limits
- Need longer build times (15 min vs 45s)
- Require more database storage/compute
- Want advanced monitoring & analytics

### Database Scaling

- **Storage**: Automatically scales, pay per GB
- **Compute**: Scales based on connections
- **Connections**: Connection pooling via PgBouncer (automatically configured)

---

## Security Best Practices

1. **JWT Secret**: Use strong, randomly generated secret
2. **Environment Variables**: Never commit to Git
3. **Database Credentials**: Rotate periodically via Vercel Dashboard
4. **HTTPS**: Automatically enabled by Vercel (force HTTPS)
5. **CORS**: Configure if needed for separate frontend
6. **Rate Limiting**: Consider Redis-based solution for production
7. **Input Validation**: Already implemented with Zod
8. **SQL Injection**: Prisma protects against this automatically

---

## Next Steps

### Recommended Enhancements

1. **Email Verification**: Add email verification for user registration
2. **Password Reset**: Implement forgot password flow
3. **Profile Pictures**: Add file upload with Vercel Blob Storage
4. **Redis Rate Limiting**: Implement distributed rate limiting with Upstash
5. **Analytics**: Add Vercel Analytics or Google Analytics
6. **Error Tracking**: Integrate Sentry or similar service
7. **Testing**: Add E2E tests with Playwright
8. **CI/CD**: Set up GitHub Actions for automated testing

### Useful Links

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Postgres Docs**: https://vercel.com/docs/storage/vercel-postgres
- **Prisma Documentation**: https://www.prisma.io/docs
- **Next.js Documentation**: https://nextjs.org/docs

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with production database
4. Review Prisma error messages
5. Check Vercel status page: https://www.vercel-status.com

---

**Congratulations!** 🎉

Your application is now deployed to production with:
- ✅ Vercel hosting (global CDN, serverless functions)
- ✅ Vercel Postgres database (managed, auto-scaling)
- ✅ Automatic HTTPS & SSL certificates
- ✅ Continuous deployment from Git
- ✅ Production-ready authentication system
- ✅ Complete CRUD operations
- ✅ Search & filter functionality

**Your app is live at**: `https://your-project-name.vercel.app`
