# Vercel Deployment Setup Guide

This guide will help you configure your SkillLens AI application for deployment on Vercel.

## Required Environment Variables

You need to set the following environment variables in your Vercel project settings:

### 1. Database Configuration
```
DATABASE_URL="file:./dev.db"
```
**Note:** For production, you should use a proper database like:
- **Vercel Postgres** (Recommended)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Neon** (PostgreSQL)

If using SQLite (not recommended for production), the database file will be stored in `/tmp` on Vercel.

### 2. Gemini API Key
```
GEMINI_API_KEY="your-gemini-api-key-here"
```

Get your API key from: https://makersuite.google.com/app/apikey

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your database connection string
   - **Environment**: Production, Preview, Development (select all)
4. Repeat for `GEMINI_API_KEY`

## Database Setup for Production

### Option 1: Vercel Postgres (Recommended)

1. In Vercel dashboard, go to **Storage** → **Create Database** → **Postgres**
2. Copy the connection string
3. Update your `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: SQLite (Development Only)

SQLite works for development but has limitations in production:
- Database is stored in `/tmp` (ephemeral)
- Data may be lost between deployments
- Not suitable for production workloads

## Build Configuration

The project is already configured with:
- `postinstall` script: Runs `prisma generate` after npm install
- `build` script: Runs `prisma generate && next build`

This ensures Prisma Client is generated during the Vercel build process.

## Troubleshooting

### Prisma Client Not Generated
- Ensure `postinstall` script is in `package.json`
- Check build logs for Prisma generation errors
- Verify `DATABASE_URL` is set correctly

### Database Connection Errors
- Verify `DATABASE_URL` format matches your database provider
- Check database credentials
- Ensure database is accessible from Vercel's IP ranges

### API Errors
- Verify `GEMINI_API_KEY` is set
- Check API key permissions and quotas
- Review Vercel function logs for detailed error messages

## Next Steps

1. Set all environment variables in Vercel
2. Push your code to GitHub (main branch)
3. Vercel will automatically deploy
4. Monitor the deployment logs for any issues
