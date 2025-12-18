# Render Deployment - Memory Optimization Guide

## Problem
Render's free tier has limited memory (512MB), which can cause out-of-memory errors during NestJS builds.

## Solutions

### Option 1: Optimize TypeScript Build (Recommended)

Update your `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... existing options ...
    "incremental": false,  // Disable incremental builds to save memory
    "sourceMap": false     // Disable source maps in production
  }
}
```

### Option 2: Use Railway Instead (Easier)

Railway has better free tier memory limits:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects NestJS
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `PORT` (Railway sets this automatically)
7. Deploy!

**Railway Free Tier:**
- 512MB RAM (same as Render)
- $5 free credit/month
- No sleep time
- Better build optimization

### Option 3: Split the Build

If you must use Render, build locally and deploy the dist folder:

1. Build locally:
```bash
cd backend
npm run build
```

2. Update `render.yaml`:
```yaml
buildCommand: npm install --production
startCommand: node dist/main.js
```

3. Commit the `dist` folder (remove from .gitignore temporarily)
4. Deploy to Render

### Option 4: Upgrade Render Plan

Upgrade to Render's Starter plan ($7/month) for 512MB+ RAM and no sleep time.

## Current Configuration

Your `render.yaml` is already optimized with:
- Memory limit: `NODE_OPTIONS="--max-old-space-size=512"`
- Direct node execution: `node dist/main.js`
- Production-only dependencies during runtime

## Recommended Next Steps

1. **Try Railway** - Easiest solution with better free tier
2. **Or optimize tsconfig.json** - Disable incremental builds and source maps
3. **Or upgrade Render** - $7/month for reliable deployment

## Port Configuration

✅ Your `main.ts` is already configured correctly:
```typescript
await app.listen(port, '0.0.0.0');
```

This binds to all network interfaces, which Render requires.
