#!/bin/bash

echo "🌾 Welcome to MweaRicePro ERP System Setup"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   You can install it with: sudo apt-get install postgresql postgresql-contrib"
fi

echo ""
echo "📦 Setting up Backend (Flask)..."
echo "=================================="

# Create virtual environment
cd server
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

echo ""
echo "📦 Setting up Frontend (React)..."
echo "=================================="

# Install Node.js dependencies
cd ../client
npm install

echo ""
echo "🗄️  Database Setup"
echo "=================="

echo "Please make sure PostgreSQL is running and create a database named 'mwearicepro'"
echo "You can do this with:"
echo "  sudo -u postgres psql"
echo "  CREATE DATABASE mwearicepro;"
echo "  \q"

echo ""
echo "🚀 Starting the Application"
echo "=========================="

echo "To start the backend server:"
echo "  cd server"
echo "  source venv/bin/activate"
echo "  python app.py"

echo ""
echo "To start the frontend development server:"
echo "  cd client"
echo "  npm start"

echo ""
echo "✅ Setup complete! The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"

echo ""
echo "📝 Next Steps:"
echo "1. Start the backend server"
echo "2. Start the frontend server"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Add some inventory and customers to get started" 