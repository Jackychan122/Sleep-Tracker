# Deployment Guide

This guide covers various deployment options for the Sleep Tracker application.

## Table of Contents

1. [Build Preparation](#build-preparation)
2. [Deployment Options](#deployment-options)
3. [Environment Configuration](#environment-configuration)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Monitoring and Analytics](#monitoring-and-analytics)
6. [Troubleshooting](#troubleshooting)

---

## Build Preparation

### Prerequisites

Ensure you have Node.js 18+ installed:

```bash
node --version  # Should be v18 or higher
npm --version
```

### Install Dependencies

```bash
npm install
```

### Run Build

```bash
npm run build
```

This will:
1. Run TypeScript type checking
2. Build the application with Vite
3. Output files to the `dist/` directory
4. Generate optimized production assets

### Test Production Build Locally

```bash
npm run preview
```

This serves the production build locally at `http://localhost:4173` for testing.

---

## Deployment Options

### Option 1: GitHub Pages (Free, Recommended for Open Source)

#### Setup

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Update vite.config.ts**:
```typescript
base: '/your-repo-name/', // Add this to the config
```

3. **Add deploy script to package.json**:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist",
  "deploy:force": "npm run build && gh-pages -d dist --force"
}
```

4. **Deploy**:
```bash
npm run deploy
```

#### Automatic Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v1
        with:
          path: './dist'
      - uses: actions/deploy-pages@v1
```

#### Access Your Site

Your site will be available at:
```
https://yourusername.github.io/your-repo-name/
```

---

### Option 2: Netlify (Free Tier, Recommended for Production)

#### Setup via Website

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up/login
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

#### Setup via CLI

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login**:
```bash
netlify login
```

3. **Initialize**:
```bash
netlify init
```

4. **Deploy**:
```bash
netlify deploy --prod
```

#### Environment Variables

Add these in Netlify dashboard under Site Settings → Environment Variables:

```
VITE_APP_NAME=Sleep Tracker
VITE_APP_VERSION=1.0.0
```

#### Custom Domain

1. Go to Domain Settings
2. Add custom domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

---

### Option 3: Vercel (Free Tier)

#### Setup via Website

1. Go to [vercel.com](https://vercel.com/)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist
6. Click "Deploy"

#### Setup via CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Deploy to production**:
```bash
vercel --prod
```

#### Environment Variables

Create `.env.production`:
```env
VITE_APP_NAME=Sleep Tracker
VITE_APP_VERSION=1.0.0
```

---

### Option 4: AWS S3 + CloudFront

#### Create S3 Bucket

1. Go to AWS Console → S3
2. Create bucket:
   - **Bucket name**: your-domain-name
   - **Region**: choose closest to users
   - **Block public access**: Uncheck all (for static website)
3. Enable static website hosting
4. Set bucket policy for public read

#### Upload Files

```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure

# Sync files
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Set up CloudFront (Optional)

1. Create CloudFront distribution
2. Origin: S3 bucket
3. Default cache behavior: redirect HTTP to HTTPS
4. Add custom domain (CNAME)

---

### Option 5: Surge.sh (Simple, Free)

#### Install and Deploy

```bash
npm install -g surge
npm run build
surge dist your-domain.surge.sh
```

#### Custom Domain

```bash
surge dist your-custom-domain.com
```

---

## Environment Configuration

### Environment Variables

Create `.env.production` in the root directory:

```env
# Application
VITE_APP_NAME=Sleep Tracker
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_DEFAULT_TIME_ZONE=UTC

# Storage
VITE_LOCAL_STORAGE_KEY=sleep-tracker-data
VITE_MAX_RECORDS=1000
```

### Access in Code

```typescript
const appName = import.meta.env.VITE_APP_NAME;
const version = import.meta.env.VITE_APP_VERSION;
```

---

## Custom Domain Setup

### Step 1: Choose Domain Provider

Popular options:
- Namecheap
- GoDaddy
- Google Domains
- Cloudflare Registrar

### Step 2: Configure DNS

For Netlify/Vercel, add these records:

```
Type: A
Name: @
Value: 75.2.70.75 (Netlify) or 76.76.21.21 (Vercel)

Type: CNAME
Name: www
Value: your-app.netlify.app (or Vercel equivalent)
```

### Step 3: Enable HTTPS

Most platforms enable HTTPS automatically with Let's Encrypt:

- **Netlify**: Automatic
- **Vercel**: Automatic
- **GitHub Pages**: Automatic
- **AWS CloudFront**: Configure certificate in ACM

---

## Performance Optimization

### Bundle Size Analysis

```bash
npm run build
# Check the output for bundle size warnings
```

To analyze further:

```bash
npm install -g rollup-plugin-visualizer
# Add to vite.config.ts, then build
```

### Enable Compression

Most platforms automatically serve compressed assets. For manual setup:

**Nginx config**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### Cache Strategy

Set appropriate cache headers in your hosting platform:

- **HTML**: No cache (always fresh)
- **CSS/JS**: 1 year with filename hashing
- **Images**: 30 days
- **Fonts**: 1 year

---

## Monitoring and Analytics

### Error Tracking

Since this is a client-side only app, consider:

1. **Console error monitoring**:
```typescript
window.onerror = (message, source, lineno, colno, error) => {
  // Log to your error tracking service
  console.error('Error:', message);
};
```

2. **LocalStorage error handling**:
```typescript
try {
  localStorage.setItem('key', 'value');
} catch (e) {
  if (e instanceof QuotaExceededError) {
    console.error('Storage quota exceeded');
  }
}
```

### Optional Analytics

If you want to add analytics:

1. **Create environment variable**:
```env
VITE_ENABLE_ANALYTICS=true
VITE_GA_ID=G-XXXXXXXXXX
```

2. **Add tracking**:
```typescript
if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
  // Initialize analytics
}
```

---

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build

**Solution**:
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix linting issues
npm run lint:fix
```

### Blank Page After Deploy

**Issue**: White screen, console errors

**Solutions**:

1. **Check base path** in `vite.config.ts`:
```typescript
// For GitHub Pages with repo name
base: '/repo-name/',

// For custom domain
base: '/',
```

2. **Check console for errors**:
- Open browser DevTools (F12)
- Look for 404 errors
- Verify asset paths

3. **Verify build output**:
```bash
npm run build
# Check dist/ folder contents
```

### LocalStorage Not Persisting

**Issue**: Data lost on page refresh

**Solutions**:

1. **Check browser compatibility**:
- Modern browsers (Chrome, Firefox, Safari, Edge) supported
- IE11 not supported

2. **Check storage quota**:
```javascript
console.log(localStorage);
// Look for QuotaExceededError
```

3. **Verify in incognito/private mode**:
- Some browsers limit localStorage in private mode
- Test in normal mode

### Routing Issues

**Issue**: 404 on page refresh

**Solutions**:

**For Netlify**: Create `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**For Vercel**: Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**For GitHub Pages**: Use hash routing or 404 workaround

### Slow Performance

**Issue**: App loads slowly

**Solutions**:

1. **Check bundle size**:
```bash
npm run build
# Look for warnings about large chunks
```

2. **Enable production mode**:
```bash
NODE_ENV=production npm run build
```

3. **Use lazy loading**:
```typescript
const AnalyticsView = lazy(() => import('./components/analytics/AnalyticsView'));
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Security Considerations

### Content Security Policy

Add `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
">
```

### HTTPS Only

Redirect HTTP to HTTPS:

**Netlify**: Automatic
**Vercel**: Automatic
**Custom**: Add server config

### Data Privacy

- All data stored locally
- No external API calls
- No third-party tracking (unless added)
- Clear data option for users

---

## Maintenance

### Regular Updates

1. **Update dependencies**:
```bash
npm audit
npm update
```

2. **Test after updates**:
```bash
npm test
npm run build
```

3. **Deploy**:
```bash
npm run deploy
```

### Backup Strategy

- Users can export their data
- Provide clear instructions for backup
- Consider adding automated backup reminders

### Version Management

Use semantic versioning:
- **Major**: Breaking changes
- **Minor**: New features
- **Patch**: Bug fixes

Update version in `package.json` before releases.

---

## Support

For deployment issues:
1. Check this guide's troubleshooting section
2. Review platform-specific documentation
3. Check GitHub issues
4. Open a new issue with details

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm test                # Run tests
npm run test:coverage   # Run tests with coverage

# Linting
npm run lint            # Check for issues
npm run lint:fix        # Fix issues automatically

# Formatting
npm run format          # Format code
npm run format:check    # Check formatting

# Deployment
npm run deploy          # Deploy to GitHub Pages
```

### File Locations

- **Build output**: `dist/`
- **Source code**: `src/`
- **Tests**: `src/__tests__/` and `src/**/__tests__/`
- **Config files**: Root directory

---

Happy deploying! 🚀
