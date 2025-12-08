# 🚀 Vercel Deployment Guide

**Project:** Personal Blog & Portfolio - Fauzi M. Noor
**Date:** December 7, 2025

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Start

- [x] Application tested locally (`npm run dev`)
- [x] No critical errors in code
- [x] Environment variables ready
- [x] Supabase database configured
- [x] `.env` file in `.gitignore`
- [ ] GitHub repository ready
- [ ] Vercel account created

---

## 🔐 Step 1: Prepare Environment Variables

### 1.1 List Your Environment Variables

Create a list of all environment variables from your `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SERVER_URL=your-server-url (optional)
```

**⚠️ IMPORTANT:**

- Never commit `.env` to git
- Keep these values safe - you'll need them for Vercel

---

## 📦 Step 2: Prepare Your Repository

### 2.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `personal-blog-portfolio` (or your choice)
3. Description: "Personal Blog & Portfolio Website"
4. **Keep it Private** (recommended for personal projects)
5. **Don't** initialize with README (you already have one)
6. Click "Create repository"

### 2.3 Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:**

- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find your repository and click "Import"

### 3.3 Configure Project

**Framework Preset:** Next.js (auto-detected) ✅

**Root Directory:** `./` (default) ✅

**Build Command:**

```bash
npm run build
```

**Output Directory:**

```
.next
```

**Install Command:**

```bash
npm install
```

---

## 🔑 Step 4: Add Environment Variables

### 4.1 In Vercel Dashboard

1. Go to "Settings" tab
2. Click "Environment Variables"
3. Add each variable:

**Variable 1:**

- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase URL
- **Environment:** Production, Preview, Development (select all)

**Variable 2:**

- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase Anon Key
- **Environment:** Production, Preview, Development (select all)

**Variable 3 (Optional):**

- **Key:** `NEXT_PUBLIC_SERVER_URL`
- **Value:** Your server URL
- **Environment:** Production, Preview, Development (select all)

### 4.2 Save Variables

Click "Save" after adding each variable.

---

## 🚀 Step 5: Deploy!

### 5.1 Start Deployment

1. Click "Deploy" button
2. Wait for build to complete (3-5 minutes)
3. Watch the build logs for any errors

### 5.2 Build Process

Vercel will:

1. ✅ Clone your repository
2. ✅ Install dependencies (`npm install`)
3. ✅ Build your application (`npm run build`)
4. ✅ Deploy to CDN
5. ✅ Generate deployment URL

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Deployment URL

After successful deployment, you'll get:

- **Production URL:** `https://your-project.vercel.app`
- **Preview URL:** `https://your-project-git-main.vercel.app`

### 6.2 Test Your Application

1. Open the production URL
2. Test these pages:

   - ✅ Homepage: `/`
   - ✅ About: `/tentang-saya`
   - ✅ Blog: `/post`
   - ✅ Sign In: `/auth/supabase/sign-in`
   - ✅ Dashboard: `/dashboard` (after login)

3. Test functionality:
   - ✅ Login works
   - ✅ Images load
   - ✅ Database connection works
   - ✅ Forms submit correctly

---

## 🔧 Step 7: Configure Custom Domain (Optional)

### 7.1 Add Custom Domain

1. Go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration instructions

### 7.2 DNS Configuration

Add these records to your domain provider:

**For root domain (yourdomain.com):**

```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 7.3 Wait for DNS Propagation

- Usually takes 5-60 minutes
- Can take up to 48 hours in some cases

---

## 🔄 Step 8: Automatic Deployments

### 8.1 How It Works

Every time you push to GitHub:

1. Vercel automatically detects changes
2. Builds and deploys new version
3. Updates production URL

### 8.2 Deploy New Changes

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically deploy! 🎉

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**

```bash
# Solution: Clear cache and rebuild
vercel --force
```

**Error: "Environment variable not found"**

- Check Vercel dashboard → Settings → Environment Variables
- Make sure all variables are added
- Redeploy after adding variables

### Database Connection Issues

**Error: "Failed to connect to Supabase"**

1. Check Supabase URL is correct
2. Check Anon Key is correct
3. Verify Supabase project is active
4. Check RLS policies allow access

### Images Not Loading

**Error: "Image optimization error"**

1. Check image paths are correct
2. Verify images exist in `public/` folder
3. Check Supabase Storage bucket is public

---

## 📊 Monitoring & Analytics

### 8.1 Vercel Analytics

1. Go to "Analytics" tab
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### 8.2 Build Logs

1. Go to "Deployments" tab
2. Click on any deployment
3. View build logs for debugging

---

## 🔐 Security Best Practices

### ✅ Do's

- ✅ Use environment variables for secrets
- ✅ Keep `.env` in `.gitignore`
- ✅ Use HTTPS (automatic with Vercel)
- ✅ Enable Vercel's security headers
- ✅ Regular security updates

### ❌ Don'ts

- ❌ Never commit `.env` to git
- ❌ Don't hardcode API keys
- ❌ Don't expose sensitive data in client code
- ❌ Don't disable security features

---

## 📝 Post-Deployment Checklist

- [ ] Production URL works
- [ ] All pages load correctly
- [ ] Login/authentication works
- [ ] Database queries work
- [ ] Images load properly
- [ ] Forms submit successfully
- [ ] Mobile responsive
- [ ] Performance is good
- [ ] No console errors
- [ ] Analytics tracking works

---

## 🎯 Next Steps

### After Successful Deployment

1. **Share Your Site**

   - Share production URL with others
   - Add to your portfolio
   - Share on social media

2. **Monitor Performance**

   - Check Vercel Analytics
   - Monitor error logs
   - Track user behavior

3. **Continuous Improvement**
   - Fix bugs as they appear
   - Add new features
   - Optimize performance

---

## 📚 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## 🆘 Need Help?

### Vercel Support

- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: https://vercel.com/support

### Project Support

- Check documentation in `docs/` folder
- Review `mulai_dari_sini.md`
- Check build logs in Vercel

---

**Deployment Guide Created:** December 7, 2025
**By:** Kiro AI Assistant

**Good luck with your deployment! 🚀**
