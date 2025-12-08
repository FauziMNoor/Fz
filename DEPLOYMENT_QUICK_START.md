# 🚀 Quick Deployment Guide

**Deploy to Vercel in 10 Minutes!**

---

## ⚡ Quick Steps

### 1️⃣ Prepare Environment Variables (2 min)

Copy these from your `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

---

### 2️⃣ Push to GitHub (3 min)

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### 3️⃣ Deploy to Vercel (5 min)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click "Deploy"
5. Wait 3-5 minutes ⏳

---

## ✅ Done!

Your site is live at: `https://your-project.vercel.app`

---

## 📚 Need More Details?

See full guide: [docs/VERCEL_DEPLOYMENT_GUIDE.md](docs/VERCEL_DEPLOYMENT_GUIDE.md)

---

**Happy Deploying! 🎉**
