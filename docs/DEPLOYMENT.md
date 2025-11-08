# Property Pulse - Deployment Guide

## Deployment Overview

This guide covers deploying the Property Pulse application using free hosting services:
- **Backend**: Render.com
- **Frontend**: Vercel
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary

## Prerequisites

- GitHub account
- Render account
- Vercel account
- MongoDB Atlas account
- Cloudinary account
- OpenAI API key

## Step 1: Prepare Repository

### 1.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 1.2 Create Separate Branches (Optional)

For better organization, you can create separate branches for frontend and backend:

```bash
git checkout -b production
git push origin production
```

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [Render.com](https://render.com/)
2. Sign up or log in with GitHub

### 2.2 Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: property-pulse-api
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Add Environment Variables

In Render dashboard, add these environment variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/property-pulse
JWT_SECRET=your_secure_random_string_min_32_characters
OPENAI_API_KEY=sk-your-openai-api-key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://property-pulse-api.onrender.com`)

**Important Notes:**
- Free tier apps spin down after inactivity
- First request after inactivity may take 30-60 seconds
- Consider upgrading for production use

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up or log in with GitHub

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variable

Add this environment variable:

```
VITE_API_URL=https://property-pulse-api.onrender.com/api
```

Replace with your actual Render backend URL.

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `https://your-app-name.vercel.app`

### 3.5 Custom Domain (Optional)

1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Step 4: Configure MongoDB Atlas

### 4.1 Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Choose a cloud provider and region
4. Name your cluster

### 4.2 Create Database User

1. Go to "Database Access"
2. Add new database user
3. Choose password authentication
4. Save username and password

### 4.3 Configure Network Access

1. Go to "Network Access"
2. Add IP Address
3. For development: `0.0.0.0/0` (allow from anywhere)
4. For production: Add specific IP addresses or use `0.0.0.0/0` with caution

### 4.4 Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add to Render environment variables as `MONGODB_URI`

## Step 5: Configure Cloudinary

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add to Render environment variables

## Step 6: Configure OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys
3. Create new secret key
4. Add to Render environment variables as `OPENAI_API_KEY`
5. Set up billing and usage limits

## Step 7: Update CORS Settings

In `server/src/server.ts`, update CORS configuration for production:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.vercel.app'] 
    : '*',
  credentials: true
}));
```

Commit and push this change to trigger redeployment.

## Step 8: Test Deployment

### 8.1 Backend Testing

Test API endpoints:

```bash
# Health check
curl https://property-pulse-api.onrender.com/api/health

# Register user
curl -X POST https://property-pulse-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### 8.2 Frontend Testing

1. Visit your Vercel URL
2. Test user registration
3. Test login
4. Create a property listing
5. Test AI search
6. Test favorites functionality

## Step 9: Monitoring and Maintenance

### Render Monitoring

1. Check logs in Render dashboard
2. Monitor service status
3. Set up health checks

### Vercel Monitoring

1. Check deployment logs
2. Monitor function invocations
3. Review analytics

### MongoDB Atlas Monitoring

1. Monitor database metrics
2. Check query performance
3. Review storage usage

### Cloudinary Monitoring

1. Check usage statistics
2. Monitor bandwidth
3. Review storage limits

## Troubleshooting

### Backend Issues

**Service not responding:**
- Check Render logs
- Verify environment variables
- Ensure MongoDB connection string is correct

**Database connection error:**
- Verify MongoDB URI
- Check network access settings
- Ensure database user credentials are correct

### Frontend Issues

**API connection error:**
- Verify VITE_API_URL is correct
- Check CORS settings
- Ensure backend is running

**Build failures:**
- Check Vercel build logs
- Verify all dependencies are in package.json
- Ensure Node version compatibility

### Common Issues

**CORS errors:**
```typescript
// Update server CORS configuration
app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'http://localhost:3000' // for development
  ],
  credentials: true
}));
```

**Environment variables not loading:**
- Redeploy after adding/updating env vars
- Check variable names match exactly
- Verify no extra spaces in values

**Image upload failing:**
- Check Cloudinary credentials
- Verify file size limits
- Review Cloudinary usage quota

## Performance Optimization

### Backend

1. Enable compression:
```typescript
import compression from 'compression';
app.use(compression());
```

2. Add caching headers
3. Optimize database queries with indexes

### Frontend

1. Lazy load routes:
```typescript
const Home = lazy(() => import('./pages/Home'));
```

2. Optimize images
3. Enable Vercel Analytics

## Security Checklist

- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Validate all user inputs
- [ ] Sanitize database queries
- [ ] Rate limit sensitive endpoints
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Configure proper CORS settings
- [ ] Implement request size limits
- [ ] Add security headers

## Scaling Considerations

### When to Upgrade

Consider upgrading from free tiers when:
- Response times exceed acceptable limits
- You hit rate limits frequently
- Need custom domains
- Require guaranteed uptime
- Database storage exceeds free tier

### Recommended Upgrades

1. **Render**: Start at $7/month for always-on service
2. **MongoDB Atlas**: Shared cluster ($9/month)
3. **Vercel**: Pro plan ($20/month)
4. **Cloudinary**: Plus plan ($89/month)

## Backup Strategy

### Database Backups

1. Use MongoDB Atlas automated backups (available in paid tiers)
2. Or implement manual backup script
3. Store backups in separate location

### Code Backups

1. Keep GitHub repository updated
2. Tag releases
3. Maintain separate production branch

## CI/CD Setup (Optional)

### Automatic Deployments

**Render:**
- Auto-deploys on push to main branch
- Configure in Render dashboard

**Vercel:**
- Auto-deploys on push to main branch
- Preview deployments for PRs

### GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test
        run: |
          cd server
          npm install
          npm test
```

## Support and Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Estimated Costs

### Free Tier Limits

- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Vercel**: 100GB bandwidth/month
- **MongoDB Atlas**: 512MB storage
- **Cloudinary**: 25GB storage, 25GB bandwidth
- **OpenAI**: Pay per use (no free tier)

### Expected Monthly Costs

For small to medium traffic:
- OpenAI: $10-50 (varies with usage)
- Other services: $0 (free tier)

**Total**: ~$10-50/month

For production with upgrades:
- Render: $7-25
- Vercel: $20
- MongoDB: $9-57
- Cloudinary: $89
- OpenAI: $50-200

**Total**: ~$175-391/month
