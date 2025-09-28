# Deployment Guide

## 🚀 Deployment Options

The AI Studio website is built as a static site and can be deployed to any hosting platform that supports static files.

## ☁️ Recommended Platforms

### 1. Netlify (Recommended)

**Why Netlify:**
- Automatic deployments from Git
- Built-in form handling for contact form
- Edge functions for advanced features
- Excellent performance with global CDN

**Setup:**
```bash
# 1. Connect repository to Netlify
# 2. Configure build settings:
Build command: npm run build
Publish directory: dist
Node version: 18.20.8

# 3. Environment variables (optional)
PUBLIC_CONTACT_ENDPOINT=/.netlify/functions/contact
```

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18.20.8"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Redirects for SPA routing
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# 404 handling
[[redirects]]
  from = "/*"
  to = "/404"
  status = 404
```

### 2. Vercel

**Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**vercel.json Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "functions": {
    "app/api/contact.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 3. GitHub Pages

**Setup with GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
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
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build website
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  ai-studio:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔧 Environment Configuration

### Production Environment Variables
```bash
# .env.production
PUBLIC_SITE_URL=https://ai-studio44.be
PUBLIC_CONTACT_ENDPOINT=https://api.ai-studio44.be/contact
PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# Optional: API keys for enhanced features
OPENAI_API_KEY=sk-...
REPLICATE_API_TOKEN=r8_...
```

### Build Optimization
```bash
# Build with optimizations
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npx astro build --verbose
```

## 📊 Performance Optimization

### CDN Configuration
```javascript
// astro.config.ts - CDN integration
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  },
});
```

### Image Optimization
```astro
---
// Responsive images for production
import { Image } from 'astro:assets';
---

<Image
  src={heroImage}
  alt="AI Studio Hero"
  widths={[400, 800, 1200, 1600]}
  sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
  loading="eager"
  format="webp"
/>
```

## 🔍 SEO & Analytics Setup

### Google Analytics 4
```astro
---
// BaseLayout.astro
const { PUBLIC_ANALYTICS_ID } = import.meta.env;
---

{PUBLIC_ANALYTICS_ID && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_ANALYTICS_ID}`}></script>
    <script is:inline define:vars={{ PUBLIC_ANALYTICS_ID }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', PUBLIC_ANALYTICS_ID);
    </script>
  </>
)}
```

### Search Console Verification
```html
<!-- Add to <head> in BaseLayout.astro -->
<meta name="google-site-verification" content="your-verification-code">
```

## 🔐 Security Considerations

### HTTPS Configuration
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name ai-studio44.be www.ai-studio44.be;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ai-studio44.be;

    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### Content Security Policy
```astro
---
// BaseLayout.astro - CSP headers
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com",
].join('; ');
---

<meta http-equiv="Content-Security-Policy" content={csp}>
```

## 📈 Monitoring & Maintenance

### Health Checks
```javascript
// public/health.json
{
  "status": "healthy",
  "timestamp": "2025-01-21T10:00:00Z",
  "version": "1.0.0"
}
```

### Log Monitoring
```bash
# Production logs monitoring
tail -f /var/log/nginx/access.log | grep -E "(404|500)"

# Performance monitoring
curl -w "@curl-format.txt" -o /dev/null -s "https://ai-studio44.be"
```

### Automated Backups
```bash
#!/bin/bash
# backup-script.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/ai-studio"

# Backup static files
tar -czf "$BACKUP_DIR/ai-studio_$DATE.tar.gz" /var/www/ai-studio

# Backup configuration
cp /etc/nginx/sites-available/ai-studio "$BACKUP_DIR/nginx_$DATE.conf"

# Clean old backups (keep last 30 days)
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Check Node.js version
node --version  # Should be 18.20.8+

# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

#### 2. 404 Errors in Production
```nginx
# Ensure proper routing configuration
location / {
    try_files $uri $uri/ /404.html;
}
```

#### 3. CSS/JS Not Loading
```astro
---
// Check base URL configuration
// astro.config.ts
export default defineConfig({
  base: '/',  // Ensure correct base path
  site: 'https://ai-studio44.be',
});
---
```

#### 4. Performance Issues
```bash
# Check Lighthouse scores
npx lighthouse https://ai-studio44.be --output html --output-path ./lighthouse-report.html

# Analyze bundle size
npm run build -- --verbose
```

### Emergency Procedures
```bash
# Quick rollback (if using Git-based deployment)
git revert HEAD
git push origin main

# Manual file restoration
cp -r /backups/ai-studio/latest/* /var/www/ai-studio/

# Restart services
sudo systemctl restart nginx
sudo systemctl restart ai-studio  # if using systemd
```

## 📋 Pre-Deployment Checklist

- [ ] **Build succeeds** without errors
- [ ] **Content validation** passes (`npm run content:check`)
- [ ] **Linting** passes (`npm run lint`)
- [ ] **Links work** in production URLs
- [ ] **Forms submit** correctly
- [ ] **Analytics** tracking configured
- [ ] **SEO meta tags** present
- [ ] **Sitemap** generates correctly
- [ ] **RSS feed** validates
- [ ] **Mobile responsive** on all pages
- [ ] **Accessibility** tested
- [ ] **Performance** score 90+
- [ ] **Security headers** configured
- [ ] **HTTPS** enforced
- [ ] **404 page** works
- [ ] **Contact form** anti-spam functional

This deployment guide ensures your AI Studio website launches smoothly with optimal performance, security, and maintainability.