# 🚀 MweaRicePro Installation Guide

This guide will help you set up the MweaRicePro ERP system on your local machine.

## 📋 Prerequisites

Before installing MweaRicePro, make sure you have the following installed:

### Required Software
- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL** - [Download PostgreSQL](https://www.postgresql.org/download/)

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: At least 2GB free space
- **OS**: Linux, macOS, or Windows

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JB-Rice
```

### 2. Run the Setup Script
```bash
./setup.sh
```

This script will:
- Check for required dependencies
- Set up the Python virtual environment
- Install Python dependencies
- Install Node.js dependencies

### 3. Database Setup

#### Option A: Using PostgreSQL (Recommended)
```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE mwearicepro;
\q
```

#### Option B: Using SQLite (Development Only)
If you don't have PostgreSQL, you can modify the Flask app to use SQLite:

Edit `server/app.py` and change:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mwearicepro.db'
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:
```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your database configuration:
```env
DATABASE_URL=postgresql://username:password@localhost/mwearicepro
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

## 🚀 Starting the Application

### 1. Start the Backend Server
```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend will be available at: http://localhost:5000

### 2. Start the Frontend Server
```bash
cd client
npm start
```

The frontend will be available at: http://localhost:3000

## 🎯 First Steps

1. **Open the Application**: Navigate to http://localhost:3000
2. **Add Inventory**: Go to Inventory page and add some rice bags
3. **Add Customers**: Go to Customers page and add restaurant and individual customers
4. **Create Orders**: Go to Orders page and create some test orders
5. **View Reports**: Check the Reports page for analytics

## 📊 Sample Data

### Sample Customers
- **Davana Hotel** (Restaurant) - KES 180/kg
- **La Enzi Club** (Restaurant) - KES 180/kg
- **John Doe** (Individual) - KES 200/kg
- **Jane Smith** (Individual) - KES 200/kg

### Sample Inventory
- Add 10 bags (600kg) at KES 9,000 per bag
- Total cost: KES 90,000

## 🔧 Configuration

### Pricing Configuration
- **Restaurant Price**: KES 180/kg
- **Individual Price**: KES 200/kg
- **Bag Cost**: KES 9,000 per 60kg bag

### Order Rules
- **Minimum Order**: 5kg
- **Order Increment**: 5kg multiples only
- **Inventory Check**: Automatic validation

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: could not connect to database
```
**Solution**: Make sure PostgreSQL is running and the database exists.

#### 2. Port Already in Use
```
Error: Address already in use
```
**Solution**: Kill the process using the port or change the port in the configuration.

#### 3. Module Not Found
```
Error: No module named 'flask'
```
**Solution**: Activate the virtual environment: `source venv/bin/activate`

#### 4. Node Modules Missing
```
Error: Cannot find module
```
**Solution**: Run `npm install` in the client directory.

### Getting Help

If you encounter any issues:

1. Check the console logs for error messages
2. Ensure all dependencies are installed
3. Verify database connection
4. Check firewall settings

## 🔒 Security Notes

- Change the default SECRET_KEY in production
- Use HTTPS in production
- Implement proper authentication
- Regular database backups
- Keep dependencies updated

## 📈 Performance Tips

- Use a production-grade database (PostgreSQL)
- Enable database connection pooling
- Implement caching for frequently accessed data
- Use a CDN for static assets in production
- Monitor application performance

## 🆘 Support

For technical support or questions:
- Check the documentation
- Review the code comments
- Create an issue in the repository

---

**Happy Rice Management! 🌾** 