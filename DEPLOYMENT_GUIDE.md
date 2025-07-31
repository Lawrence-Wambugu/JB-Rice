# 🚀 JB-Rice-Pro Deployment Guide

This guide will help you deploy your JB-Rice-Pro application to Render (backend + database) and Vercel (frontend).

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- Your code pushed to a GitHub repository

## 🗄️ **Step 1: Deploy Backend to Render**

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

### 1.2 Deploy Backend Service
1. **Click "New +" → "Web Service"**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name:** `jb-rice-pro-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Region:** Choose closest to your location

### 1.3 Set Environment Variables
In your Render service settings, add these environment variables:

```
SECRET_KEY=your-super-secret-key-here
FLASK_ENV=production
TZ=Africa/Nairobi
```

### 1.4 Create PostgreSQL Database
1. **Click "New +" → "PostgreSQL"**
2. **Configure:**
   - **Name:** `jb-rice-pro-db`
   - **Database:** `jbricepro`
   - **User:** `jbricepro`
   - **Region:** Same as your web service

### 1.5 Link Database to Service
1. Go to your web service settings
2. Add environment variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Copy from your PostgreSQL service's "Connections" tab

### 1.6 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your service URL (e.g., `https://jb-rice-pro-backend.onrender.com`)

## 🌐 **Step 2: Deploy Frontend to Vercel**

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 2.2 Deploy Frontend
1. **Click "New Project"**
2. **Import your GitHub repository**
3. **Configure:**
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### 2.3 Set Environment Variables
In your Vercel project settings, add:

```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://jb-rice-pro.vercel.app`)

## 🔧 **Step 3: Update Frontend API URL**

### 3.1 Update API Configuration
In your frontend code, update the API base URL:

```javascript
// client/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 3.2 Update Auth Service
```javascript
// client/src/services/auth.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## 🗄️ **Step 4: Initialize Database**

### 4.1 Create Database Tables
Your database will be automatically created when the app first runs, but you can also manually initialize it:

1. Go to your Render backend service
2. Check the logs to ensure tables are created
3. The app will create tables automatically on first request

## 🔍 **Step 5: Test Your Deployment**

### 5.1 Test Backend
```bash
# Test your backend API
curl https://your-backend-url.onrender.com/api/inventory
```

### 5.2 Test Frontend
1. Visit your Vercel frontend URL
2. Try to sign up/login
3. Test all features

## 📁 **File Structure for Deployment**

```
JB-Rice/
├── server/
│   ├── app.py                 # Production-ready Flask app
│   ├── requirements.txt       # Python dependencies
│   └── render.yaml           # Render configuration
├── client/
│   ├── package.json          # Node.js dependencies
│   ├── public/
│   └── src/
└── DEPLOYMENT_GUIDE.md      # This file
```

## 🔧 **Environment Variables Summary**

### Backend (Render)
```
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://user:pass@host:port/dbname
FLASK_ENV=production
TZ=Africa/Nairobi
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 🚨 **Important Notes**

### Security
- ✅ Use strong `SECRET_KEY` in production
- ✅ Enable HTTPS (automatic on Render/Vercel)
- ✅ Set up proper CORS if needed
- ⚠️ Consider implementing proper password hashing (bcrypt)
- ⚠️ Set up email service for password reset

### Performance
- ✅ Database connection pooling (automatic on Render)
- ✅ CDN for static files (automatic on Vercel)
- ✅ Automatic scaling (Render/Vercel handle this)

### Monitoring
- ✅ Render provides logs and monitoring
- ✅ Vercel provides analytics and performance metrics
- ✅ Set up error tracking (Sentry, etc.)

## 🆘 **Troubleshooting**

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` format
   - Ensure database is created and accessible

2. **CORS Errors**
   - Update CORS settings in Flask app
   - Check frontend API URL configuration

3. **Build Failures**
   - Check `requirements.txt` for all dependencies
   - Verify Python version compatibility

4. **Environment Variables**
   - Ensure all variables are set correctly
   - Check for typos in variable names

## 📞 **Support**

If you encounter issues:

1. Check Render/Vercel logs
2. Verify environment variables
3. Test locally first
4. Check this guide for common solutions

## 🎉 **Success!**

Once deployed, your JB-Rice-Pro will be available at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`

Your rice distribution business is now live and ready for customers! 🚀 