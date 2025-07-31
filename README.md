# 🌾 JB-Rice-Pro ERP System

A comprehensive Enterprise Resource Planning (ERP) system designed specifically for rice distribution businesses. Manage inventory, customers, orders, and generate detailed reports with ease.

## ✨ Features

### 📦 **Inventory Management**
- Track rice stock in real-time
- Add new rice bags (60kg each)
- Monitor available quantities
- Automatic stock updates on sales

### 👥 **Customer Management**
- Categorize customers (Restaurants vs Individuals)
- Different pricing tiers:
  - **Restaurants**: KES 180/kg
  - **Individuals**: KES 200/kg
- Complete CRUD operations
- Customer history tracking

### 📤 **Order Management**
- Create orders with automatic pricing
- Minimum order: 5kg
- Order increments: 5kg multiples only
- Delivery status tracking
- Order history and analytics

### 📊 **Reports & Analytics**
- Daily, weekly, monthly sales reports
- Customer breakdown analysis
- Profit and loss calculations
- Visual charts and graphs
- Inventory status reports

### 🔐 **User Authentication**
- Secure sign up and sign in
- Password strength validation
- Forgot password functionality
- User session management

## 🛠️ Tech Stack

### **Frontend**
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js** - Data visualization
- **Lucide React** - Beautiful icons

### **Backend**
- **Python Flask** - RESTful API framework
- **Flask SQLAlchemy** - Database ORM
- **Flask Migrate** - Database migrations
- **Flask CORS** - Cross-origin resource sharing
- **SQLite/PostgreSQL** - Database options

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JB-Rice
   ```

2. **Setup Backend**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app_sqlite.py
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
JB-Rice-Pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Flask backend
│   ├── app_sqlite.py      # Main application (SQLite)
│   ├── app.py             # Main application (PostgreSQL)
│   ├── setup_db.py        # Database setup
│   └── requirements.txt
├── docs/                   # Documentation
└── setup.sh               # Installation script
```

## 🎨 Theme

The application features a **green and white** theme inspired by rice fields:
- **Primary Green**: `#16a34a`
- **Clean White**: `#ffffff`
- **Modern gradients** and subtle shadows
- **Responsive design** for all devices

## 🔧 Business Rules

- **Minimum Order**: 5kg
- **Order Increment**: 5kg multiples only
- **Restaurant Price**: KES 180/kg
- **Individual Price**: KES 200/kg
- **Bag Weight**: 60kg per bag
- **Bag Cost**: KES 9,000 per bag
- **Profit Calculation**: Revenue - Cost of Goods Sold

## 📊 Sample Data

The system comes with sample data:
- **4 Customers** (2 restaurants, 2 individuals)
- **600kg Inventory** (10 bags)
- **Sample Orders** for testing

## 🔐 Authentication

- **User Registration** with validation
- **Secure Login** with username/email
- **Password Reset** via email
- **Session Management** with localStorage

## 🚀 Deployment

### Development
```bash
# Backend
cd server && python app_sqlite.py

# Frontend
cd client && npm start
```

### Production
```bash
# Build frontend
cd client && npm run build

# Deploy backend with PostgreSQL
# Update database configuration in server/config.py
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please refer to the documentation in the `docs/` folder.

---

**JB-Rice-Pro** - Empowering rice distributors with modern ERP solutions! 🌾 