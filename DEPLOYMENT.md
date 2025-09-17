# Deploy to Vercel

This guide will help you deploy your URL shortener to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Make sure your Supabase project is set up

## Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - URL shortener ready for deployment"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Configure environment variables (see below)
6. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? (enter your project name)
# - Directory? ./
```

### 3. Environment Variables

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

```
VITE_SUPABASE_URL=https://xklgckdrhaqybpewlhnu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbGdja2RyaGFxeWJwZXdsaG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzUwMTksImV4cCI6MjA3MzM1MTAxOX0._A8-zswybu0U_SYvYUJxYp9BxzMA1XJYmnG-OnWkDug
```

**Important**: Make sure to add these for all environments (Production, Preview, Development).

### 4. Domain Configuration

After deployment, Vercel will provide you with a URL like:
- `https://your-project-name.vercel.app`

You can also:
- Add a custom domain in **Settings > Domains**
- Configure automatic deployments from your GitHub repository

### 5. Supabase Configuration

Update your Supabase project settings:

1. Go to **Authentication > URL Configuration**
2. Add your Vercel domain to **Site URL**:
   ```
   https://your-project-name.vercel.app
   ```
3. Add redirect URLs:
   ```
   https://your-project-name.vercel.app/**
   ```

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Test the complete flow:
   - Enter a URL on the home page
   - Sign up/login
   - Shorten URLs
   - Test QR code generation
   - Test URL redirects

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Make sure variables start with `VITE_`
   - Redeploy after adding variables
   - Check variable names match exactly

2. **Supabase Connection Issues**
   - Verify Supabase URL and key are correct
   - Check Supabase project is active
   - Ensure RLS policies are set up

3. **Build Failures**
   - Check for TypeScript errors
   - Ensure all dependencies are in package.json
   - Run `npm run build` locally first

4. **Redirect Issues**
   - Verify vercel.json configuration
   - Check that redirect routes are properly set up

### Useful Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs
```

## Post-Deployment

1. **Update README**: Add your live URL to the README
2. **Test All Features**: Ensure everything works in production
3. **Monitor**: Check Vercel analytics for usage
4. **Backup**: Keep your Supabase database backed up

## Custom Domain (Optional)

To add a custom domain:

1. Go to **Settings > Domains** in Vercel
2. Add your domain
3. Update DNS records as instructed
4. Update Supabase URL configuration with your custom domain

Your URL shortener is now live on Vercel! 🚀
