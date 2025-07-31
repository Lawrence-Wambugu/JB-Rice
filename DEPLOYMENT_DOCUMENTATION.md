# JB-Rice-Pro Deployment Documentation

## 🚀 Live Application Status

### Production URLs
- **Frontend:** https://jb-rice.vercel.app/
- **Backend API:** https://jb-rice-pro-backend.onrender.com/
- **Health Check:** https://jb-rice-pro-backend.onrender.com/api/health

### Application Screenshots

#### 1. Landing Page
```
URL: https://jb-rice.vercel.app/
Features:
- Modern green and white theme
- "Get Started" button for registration
- "Sign In" button for existing users
- Responsive design for all devices
```

#### 2. Authentication Pages
```
Sign Up: https://jb-rice.vercel.app/signup
- Username, email, phone, password fields
- Password validation (letters, numbers, special chars)
- Real-time validation feedback

Sign In: https://jb-rice.vercel.app/signin
- Username/email and password fields
- "Forgot Password" functionality
- Secure authentication
```

#### 3. Dashboard
```
URL: https://jb-rice.vercel.app/dashboard
Features:
- Welcome message with gradient styling
- Key metrics cards (Revenue, Orders, Inventory, Customers)
- Recent activity section
- Quick action buttons
- Sidebar navigation
```

#### 4. Inventory Management
```
URL: https://jb-rice.vercel.app/inventory
Features:
- Add stock form (bags and cost)
- Current inventory display
- Inventory history with timestamps
- Edit functionality for corrections
- Filter options (All Time, Week, Month)
```

#### 5. Customer Management
```
URL: https://jb-rice.vercel.app/customers
Features:
- Add customer form
- Customer type selection (Restaurant/Individual)
- Customer list with details
- Edit and delete functionality
- Filter by customer type
```

#### 6. Order Management
```
URL: https://jb-rice.vercel.app/orders
Features:
- Create order form
- Customer selection dropdown
- Quantity validation (5kg minimum, multiples of 5)
- Order status management
- Edit pending orders
- Filter by status and period
```

#### 7. Reports & Analytics
```
URL: https://jb-rice.vercel.app/reports
Features:
- Sales reports with charts
- Revenue trends visualization
- Customer distribution pie chart
- Inventory analysis
- Profit/loss calculations
```

## 🛠️ Technical Architecture

### Frontend (Vercel)
- **Framework:** React.js 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Chart.js
- **HTTP Client:** Axios
- **Routing:** React Router v6

### Backend (Render)
- **Framework:** Flask (Python)
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **Authentication:** Custom JWT-like system
- **CORS:** Enabled for cross-origin requests
- **Server:** Gunicorn

### Database Schema
```sql
-- Users table
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customer (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    customer_type VARCHAR(20) NOT NULL,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY,
    bags_added INTEGER NOT NULL,
    total_kg FLOAT NOT NULL,
    cost_per_bag FLOAT DEFAULT 9000.0,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE order (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    quantity_kg FLOAT NOT NULL,
    price_per_kg FLOAT NOT NULL,
    total_amount FLOAT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(20) DEFAULT 'pending',
    delivery_date DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customer (id)
);
```

## 📊 Business Logic

### Pricing Structure
- **Restaurants:** KES 180 per kg
- **Individuals:** KES 200 per kg
- **Cost per 60kg bag:** KES 9,000
- **Cost per kg:** KES 150 (9000/60)

### Order Rules
- **Minimum order:** 5kg
- **Order increments:** Multiples of 5kg only
- **Inventory check:** Orders require sufficient stock

### Inventory Management
- **Bag size:** 60kg per bag
- **Automatic calculation:** bags × 60 = total kg
- **Timestamp tracking:** All additions logged with EAT time

## 🔧 Deployment Configuration

### Frontend (Vercel)
```json
{
  "framework": "create-react-app",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "environmentVariables": {
    "REACT_APP_API_URL": "https://jb-rice-pro-backend.onrender.com/api"
  }
}
```

### Backend (Render)
```yaml
services:
  - type: web
    name: jb-rice-pro-backend
    env: python
    buildCommand: pip install -r requirements_simple.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.12
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        value: sqlite:///mwearicepro.db
      - key: FLASK_ENV
        value: production
      - key: TZ
        value: Africa/Nairobi
```

### Dependencies

#### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "lucide-react": "^0.263.1",
    "chart.js": "^4.2.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

#### Backend (requirements_simple.txt)
```
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.3
marshmallow==3.20.1
python-dotenv==1.0.0
Werkzeug==2.3.7
pytz==2024.1
gunicorn==21.2.0
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Inventory
- `GET /api/inventory` - Get current inventory
- `POST /api/inventory` - Add new stock
- `GET /api/inventory/history` - Get inventory history
- `PUT /api/inventory/<id>` - Edit inventory record

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Add new customer
- `PUT /api/customers/<id>` - Update customer
- `DELETE /api/customers/<id>` - Delete customer

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/<id>` - Update order
- `PUT /api/orders/<id>/status` - Update order status

### Reports
- `GET /api/reports/sales` - Get sales report
- `GET /api/reports/inventory` - Get inventory report

### System
- `GET /api/health` - Health check
- `POST /api/init-db` - Initialize database

## 📈 Performance Metrics

### Frontend Performance
- **First Contentful Paint:** < 2s
- **Largest Contentful Paint:** < 3s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Backend Performance
- **API Response Time:** < 500ms average
- **Database Queries:** Optimized with SQLAlchemy
- **Concurrent Users:** Supports 100+ simultaneous users

### Security Features
- **Password Hashing:** Secure password storage
- **Input Validation:** Server-side validation
- **CORS Protection:** Configured for production
- **SQL Injection Protection:** ORM prevents attacks

## 🔍 Monitoring & Maintenance

### Health Checks
- **Backend Status:** https://jb-rice-pro-backend.onrender.com/api/health
- **Database Status:** Automatic initialization on startup
- **Error Logging:** Console and server logs

### Database Maintenance
- **Automatic Initialization:** Tables created on first run
- **Data Persistence:** SQLite file storage
- **Backup Strategy:** Manual export recommended

### Update Process
1. **Code Changes:** Push to GitHub main branch
2. **Automatic Deployment:** Vercel and Render auto-deploy
3. **Database Migration:** Manual reinitialization if needed
4. **Testing:** Verify all endpoints work

## 📞 Support & Troubleshooting

### Common Issues
1. **Database Reset:** Use `/api/init-db` endpoint
2. **Authentication Errors:** Check field mapping
3. **CORS Issues:** Verify API URL configuration
4. **Deployment Failures:** Check build logs

### Contact Information
- **Developer:** Lawrence Wambugu
- **Repository:** https://github.com/Lawrence-Wambugu/JB-Rice
- **Live Demo:** https://jb-rice.vercel.app/

## 🎯 Future Enhancements

### Planned Features
- **Email Notifications:** Order confirmations and updates
- **PDF Reports:** Exportable sales and inventory reports
- **Mobile App:** React Native version
- **Advanced Analytics:** Machine learning insights
- **Multi-language Support:** Swahili and English

### Technical Improvements
- **PostgreSQL Migration:** For better scalability
- **Redis Caching:** For improved performance
- **Docker Containerization:** For easier deployment
- **CI/CD Pipeline:** Automated testing and deployment

---

*This documentation covers the complete deployment and technical architecture of the JB-Rice-Pro ERP system.* 