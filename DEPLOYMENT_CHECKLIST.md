# 🚀 JB-Rice-Pro Deployment Checklist

## ✅ Pre-Deployment Checklist
- [x] Code pushed to GitHub
- [x] .gitignore added
- [x] node_modules removed from Git
- [x] Repository is clean

## 🗄️ Backend Deployment (Render)

### Step 1: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub account
- [ ] Verify email

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect repository: `Lawrence-Wambugu/JB-Rice`
- [ ] Configure settings:
  - [ ] Name: `jb-rice-pro-backend`
  - [ ] Environment: `Python 3.10`
  - [ ] Build Command: `pip install -r requirements.txt`
  - [ ] Start Command: `gunicorn app:app`
  - [ ] Region: Choose closest location

### Step 3: Set Environment Variables
- [ ] Add environment variables:
  - [ ] `SECRET_KEY=jb-rice-pro-super-secret-key-2024`
  - [ ] `FLASK_ENV=production`
  - [ ] `TZ=Africa/Nairobi`

### Step 4: Create Database
- [ ] Click "New +" → "PostgreSQL"
- [ ] Configure:
  - [ ] Name: `jb-rice-pro-db`
  - [ ] Database: `jbricepro`
  - [ ] User: `jbricepro`
  - [ ] Region: Same as web service

### Step 5: Link Database
- [ ] Copy DATABASE_URL from PostgreSQL service
- [ ] Add to web service environment variables:
  - [ ] Key: `DATABASE_URL`
  - [ ] Value: `postgresql://user:pass@host:port/dbname`

### Step 6: Deploy Backend
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Note the backend URL (e.g., `https://jb-rice-pro-backend.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub account

### Step 2: Create Project
- [ ] Click "New Project"
- [ ] Import repository: `Lawrence-Wambugu/JB-Rice`

### Step 3: Configure Project
- [ ] Set configuration:
  - [ ] Framework Preset: `Create React App`
  - [ ] Root Directory: `client`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`

### Step 4: Set Environment Variable
- [ ] Add environment variable:
  - [ ] Name: `REACT_APP_API_URL`
  - [ ] Value: `https://your-backend-url.onrender.com` (replace with actual backend URL)

### Step 5: Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Note the frontend URL (e.g., `https://jb-rice-pro.vercel.app`)

## 🧪 Testing Deployment

### Backend Testing
- [ ] Test API endpoint: `curl https://your-backend-url.onrender.com/api/inventory`
- [ ] Should return JSON response

### Frontend Testing
- [ ] Visit your Vercel URL
- [ ] Test sign up functionality
- [ ] Test sign in functionality
- [ ] Test all ERP features:
  - [ ] Inventory management
  - [ ] Customer management
  - [ ] Order management
  - [ ] Reports

## 📝 URLs to Note
- **Backend URL:** `https://your-backend-url.onrender.com`
- **Frontend URL:** `https://your-frontend-url.vercel.app`
- **GitHub Repository:** `https://github.com/Lawrence-Wambugu/JB-Rice`

## 🆘 Troubleshooting
- If backend fails: Check environment variables and database connection
- If frontend fails: Check build logs and environment variables
- If API calls fail: Verify `REACT_APP_API_URL` is correct

## 🎉 Success!
Once all steps are completed, your JB-Rice-Pro will be live and accessible to customers worldwide! 