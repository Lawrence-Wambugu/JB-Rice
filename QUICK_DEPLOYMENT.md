# ⚡ Quick Deployment Reference

## 🔗 Your Repository
```
GitHub: https://github.com/Lawrence-Wambugu/JB-Rice
```

## 🗄️ Render Backend Setup

### 1. Create Web Service
- **URL:** https://render.com
- **Repository:** `Lawrence-Wambugu/JB-Rice`
- **Name:** `jb-rice-pro-backend`
- **Environment:** `Python 3.10`
- **Build Command:** `pip install -r requirements_simple.txt`
- **Start Command:** `gunicorn app:app`

### 2. Environment Variables
```
SECRET_KEY=jb-rice-pro-super-secret-key-2024
FLASK_ENV=production
TZ=Africa/Nairobi
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### 3. Create PostgreSQL Database
- **Name:** `jb-rice-pro-db`
- **Database:** `jbricepro`
- **User:** `jbricepro`

## 🌐 Vercel Frontend Setup

### 1. Create Project
- **URL:** https://vercel.com
- **Repository:** `Lawrence-Wambugu/JB-Rice`
- **Framework:** `Create React App`
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `build`

### 2. Environment Variable
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 🧪 Test Commands

### Backend Test
```bash
curl https://your-backend-url.onrender.com/api/inventory
```

### Frontend Test
- Visit: `https://your-frontend-url.vercel.app`
- Test sign up/in functionality
- Test all ERP features

## 📞 Need Help?
- Check deployment logs in Render/Vercel dashboards
- Verify environment variables are set correctly
- Ensure database is connected properly 