# Quick Start: Deploy to Vercel in 10 Minutes

This is a condensed version of the full deployment guide. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Step 1: Prepare Your Code (Already Done!)

The code is already configured for Vercel deployment:
- ✅ Prisma schema set to PostgreSQL
- ✅ Build scripts include Prisma commands
- ✅ Environment variables documented
- ✅ Case-insensitive search enabled

## Step 2: Push to Git

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Push to GitHub, GitLab, or Bitbucket
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 3: Create Vercel Postgres Database

1. Go to **https://vercel.com** → Sign up/Login
2. **Storage** tab → **Create Database** → **Postgres**
3. Name: `primetrade-db`, Region: closest to you
4. Click **Create** and wait ~30 seconds

## Step 4: Import Project

1. **Add New...** → **Project** → Import your Git repo
2. **Don't deploy yet!** Go to Settings first

## Step 5: Set Environment Variables

Go to **Settings** → **Environment Variables** and add:

### Get Database URLs from Storage Tab:
1. Go to **Storage** → Click your database
2. Copy connection strings from **.env.local** tab:

```env
DATABASE_URL = <POSTGRES_PRISMA_URL value>
DIRECT_URL = <POSTGRES_URL_NON_POOLING value>
```

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```env
JWT_SECRET = <paste generated secret>
NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
NODE_ENV = production
```

**Important**: Select all three environments (Production, Preview, Development)

## Step 6: Deploy

1. Go to **Deployments** tab
2. Click **Create Deployment**
3. Wait for build to complete (~2-3 minutes)

## Step 7: Test Your App

Visit: `https://your-project-name.vercel.app`

Test the API:
```bash
# Register user
curl -X POST https://your-project-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test1234"}'

# Login
curl -X POST https://your-project-name.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

## Done! 🎉

Your app is live with:
- ✅ Production database (Vercel Postgres)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Auto-scaling

## Troubleshooting

**Build fails?**
- Check environment variables are set for all environments
- View build logs in **Deployments** tab

**Database connection error?**
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Make sure you copied `POSTGRES_PRISMA_URL` (not just `POSTGRES_URL`)

**Need help?**
- See full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Check Vercel logs in dashboard
- Verify environment variables are saved

## What's Next?

- [ ] Add custom domain (Settings → Domains)
- [ ] Set up monitoring (Pro plan)
- [ ] Configure alerts for errors
- [ ] Add analytics
- [ ] Set up staging environment (Preview deployments)

---

**Full Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive instructions including local testing, custom domains, troubleshooting, and more.
