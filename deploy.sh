#!/bin/bash

echo "🚀 JB-Rice-Pro Deployment Helper"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found!"
    echo "Please initialize git and push your code to GitHub first:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo "  git remote add origin https://github.com/yourusername/your-repo.git"
    echo "  git push -u origin main"
    echo ""
    exit 1
fi

# Check if code is pushed to GitHub
if ! git ls-remote --exit-code origin >/dev/null 2>&1; then
    echo "❌ Remote repository not found!"
    echo "Please push your code to GitHub first."
    echo ""
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check for required files
echo "📋 Checking required files..."

if [ ! -f "server/app.py" ]; then
    echo "❌ server/app.py not found"
    exit 1
fi

if [ ! -f "server/requirements.txt" ]; then
    echo "❌ server/requirements.txt not found"
    exit 1
fi

if [ ! -f "client/package.json" ]; then
    echo "❌ client/package.json not found"
    exit 1
fi

echo "✅ All required files found"
echo ""

# Display deployment steps
echo "📖 Deployment Steps:"
echo "==================="
echo ""
echo "1️⃣  BACKEND (Render):"
echo "   • Go to https://render.com"
echo "   • Sign up with GitHub"
echo "   • Click 'New +' → 'Web Service'"
echo "   • Connect your GitHub repository"
echo "   • Configure:"
echo "     - Name: jb-rice-pro-backend"
echo "     - Environment: Python 3"
echo "     - Build Command: pip install -r requirements.txt"
echo "     - Start Command: gunicorn app:app"
echo "   • Set Environment Variables:"
echo "     - SECRET_KEY=your-super-secret-key-here"
echo "     - FLASK_ENV=production"
echo "     - TZ=Africa/Nairobi"
echo ""
echo "2️⃣  DATABASE (Render):"
echo "   • Click 'New +' → 'PostgreSQL'"
echo "   • Configure:"
echo "     - Name: jb-rice-pro-db"
echo "     - Database: jbricepro"
echo "     - User: jbricepro"
echo "   • Copy DATABASE_URL to your web service"
echo ""
echo "3️⃣  FRONTEND (Vercel):"
echo "   • Go to https://vercel.com"
echo "   • Sign up with GitHub"
echo "   • Click 'New Project'"
echo "   • Import your GitHub repository"
echo "   • Configure:"
echo "     - Framework Preset: Create React App"
echo "     - Root Directory: client"
echo "     - Build Command: npm run build"
echo "     - Output Directory: build"
echo "   • Set Environment Variable:"
echo "     - REACT_APP_API_URL=https://your-backend-url.onrender.com"
echo ""
echo "4️⃣  TEST DEPLOYMENT:"
echo "   • Test backend: curl https://your-backend-url.onrender.com/api/inventory"
echo "   • Test frontend: Visit your Vercel URL"
echo "   • Sign up and test all features"
echo ""

# Get current git remote URL
REMOTE_URL=$(git remote get-url origin)
echo "🔗 Your GitHub repository: $REMOTE_URL"
echo ""

echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Good luck with your deployment!" 