# JB-Rice-Pro ERP System - User Manual

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Dashboard](#dashboard)
5. [Inventory Management](#inventory-management)
6. [Customer Management](#customer-management)
7. [Order Management](#order-management)
8. [Reports & Analytics](#reports--analytics)
9. [Settings](#settings)
10. [Troubleshooting](#troubleshooting)

---

## 🏢 System Overview

**JB-Rice-Pro** is a comprehensive ERP (Enterprise Resource Planning) system designed specifically for rice distribution businesses. The system manages inventory, customers, orders, and provides detailed analytics.

### 🌐 Live Application URLs
- **Frontend:** https://jb-rice.vercel.app/
- **Backend API:** https://jb-rice-pro-backend.onrender.com/

### 🎯 Key Features
- **Inventory Management:** Track rice bags and kilograms
- **Customer Management:** Manage restaurants and individual customers
- **Order Processing:** Create and track delivery orders
- **Sales Analytics:** Generate detailed reports
- **User Authentication:** Secure login and registration

---

## 🚀 Getting Started

### 1. Access the Application
1. Open your web browser
2. Navigate to: **https://jb-rice.vercel.app/**
3. You'll see the landing page with "Get Started" and "Sign In" options

### 2. Create Your Account
1. Click **"Get Started"** button
2. Fill in the registration form:
   - **Username:** Choose a unique username
   - **Email:** Enter your email address
   - **Phone:** Enter your phone number
   - **Password:** Must include letters, numbers, and special characters (min 6 characters)
   - **Confirm Password:** Re-enter your password
3. Click **"Create Account"**
4. You'll be redirected to the sign-in page

### 3. Sign In
1. Enter your username or email
2. Enter your password
3. Click **"Sign In"**
4. You'll be redirected to the dashboard

---

## 🔐 Authentication

### Registration Process
- **Username:** Must be unique
- **Email:** Must be unique and valid format
- **Phone:** Required for contact information
- **Password Requirements:**
  - Minimum 6 characters
  - At least one letter
  - At least one number
  - At least one special character

### Sign In Process
- Use either username or email to sign in
- Password is case-sensitive
- Forgot password feature available

### Password Reset
1. Click **"Forgot your password?"** on sign-in page
2. Enter your registered email
3. Check your email for reset instructions
4. Follow the link to reset your password

---

## 📊 Dashboard

### Overview
The dashboard provides a comprehensive overview of your rice business:

### Key Metrics Displayed
- **Total Revenue:** Current period earnings
- **Total Orders:** Number of orders processed
- **Available Inventory:** Rice in stock (kg)
- **Total Customers:** Registered customers count

### Recent Activity
- Latest orders with status
- Recent inventory additions
- Customer activity

### Quick Actions
- Add new inventory
- Create new order
- Add new customer
- View reports

---

## 📦 Inventory Management

### Adding Stock
1. Navigate to **"Inventory"** in the sidebar
2. Click **"Add Stock"** button
3. Fill in the form:
   - **Number of Bags:** Enter quantity (60kg bags)
   - **Cost per Bag:** Default is KES 9,000
4. Click **"Add Stock"**
5. System automatically calculates total kg (bags × 60)

### Viewing Inventory
- **Current Stock:** Available rice in kg and bags
- **Total Added:** Historical stock additions
- **Total Sold:** Rice sold to customers
- **Available:** Current stock minus sold

### Inventory History
- **Filter Options:** All Time, This Week, This Month
- **Edit Records:** Click pencil icon to modify entries
- **Timestamp:** Each entry shows when stock was added

### Editing Inventory
1. Click the **pencil icon** next to any record
2. Modify the number of bags or cost
3. Click **"Update Record"**
4. System recalculates inventory totals

---

## 👥 Customer Management

### Adding Customers
1. Navigate to **"Customers"** in the sidebar
2. Click **"Add Customer"** button
3. Fill in customer details:
   - **Name:** Customer's full name
   - **Phone:** Contact number
   - **Email:** Email address (optional)
   - **Customer Type:** Restaurant or Individual
   - **Address:** Delivery address
4. Click **"Add Customer"**

### Customer Types & Pricing
- **Restaurants:** KES 180 per kg
- **Individuals:** KES 200 per kg

### Managing Customers
- **View All:** See complete customer list
- **Filter by Type:** Restaurant or Individual
- **Edit Details:** Update customer information
- **Delete:** Remove customer records

---

## 🛒 Order Management

### Creating Orders
1. Navigate to **"Orders"** in the sidebar
2. Click **"Create Order"** button
3. Fill in order details:
   - **Customer:** Select from dropdown
   - **Quantity (kg):** Minimum 5kg, multiples of 5kg only
4. Click **"Create Order"**
5. System automatically calculates price based on customer type

### Order Status Management
- **Pending:** New orders awaiting delivery
- **Delivered:** Completed orders
- **Cancelled:** Cancelled orders

### Order Actions
- **Edit Order:** Modify pending orders only
- **Mark Delivered:** Update delivery status
- **Cancel Order:** Cancel pending orders

### Filtering Orders
- **Status Filter:** Pending, Delivered, Cancelled, All
- **Period Filter:** This Week, This Month, All Time

---

## 📈 Reports & Analytics

### Sales Reports
1. Navigate to **"Reports"** in the sidebar
2. Select time period:
   - **Daily:** Today's sales
   - **Weekly:** Last 7 days
   - **Monthly:** Last 30 days

### Report Data
- **Total Revenue:** Sales amount
- **Total Orders:** Number of orders
- **Total kg Sold:** Quantity sold
- **Profit Calculation:** Revenue minus cost
- **Customer Breakdown:** Restaurant vs Individual sales

### Inventory Reports
- **Total Purchased:** Stock bought
- **Total Sold:** Stock sold
- **Available Stock:** Current inventory
- **Cost Analysis:** Purchase costs vs sales revenue

### Visual Charts
- **Revenue Trends:** Line chart showing sales over time
- **Customer Distribution:** Pie chart of customer types
- **Inventory Levels:** Bar chart of stock levels

---

## ⚙️ Settings

### System Information
- **Application Name:** JB-Rice-Pro
- **Version:** Current system version
- **Database:** SQLite (local storage)

### Business Rules
- **Minimum Order:** 5kg
- **Order Increments:** Multiples of 5kg only
- **Restaurant Pricing:** KES 180/kg
- **Individual Pricing:** KES 200/kg
- **Bag Size:** 60kg per bag
- **Cost per Bag:** KES 9,000

---

## 🔧 Troubleshooting

### Common Issues

#### Can't Sign In
- **Check credentials:** Ensure username/email and password are correct
- **Password requirements:** Must meet all criteria
- **Account exists:** Verify you've registered

#### Inventory Not Updating
- **Refresh page:** Reload the application
- **Check calculations:** Verify bag count and kg calculations
- **Edit records:** Use edit function to correct mistakes

#### Orders Not Creating
- **Check inventory:** Ensure sufficient stock available
- **Verify quantity:** Must be minimum 5kg and multiples of 5
- **Customer selection:** Ensure customer is selected

#### Reports Not Loading
- **Check data:** Ensure you have orders/inventory data
- **Select period:** Choose appropriate time period
- **Refresh:** Reload the reports page

### Technical Support
- **Backend Status:** https://jb-rice-pro-backend.onrender.com/api/health
- **Database Reset:** Contact administrator for database reinitialization

---

## 📱 System Requirements

### Browser Compatibility
- **Chrome:** Version 90+
- **Firefox:** Version 88+
- **Safari:** Version 14+
- **Edge:** Version 90+

### Internet Connection
- **Required:** Stable internet connection
- **Speed:** Minimum 1 Mbps recommended

---

## 🎯 Best Practices

### Data Management
- **Regular backups:** Export data periodically
- **Accurate entries:** Double-check all input data
- **Consistent naming:** Use clear customer names

### Inventory Control
- **Monitor stock:** Check inventory levels regularly
- **Update promptly:** Add new stock immediately
- **Track costs:** Maintain accurate cost records

### Customer Service
- **Verify details:** Confirm customer information
- **Track preferences:** Note customer requirements
- **Follow up:** Monitor order delivery status

---

## 📞 Support Information

### Application URLs
- **Production Frontend:** https://jb-rice.vercel.app/
- **Production Backend:** https://jb-rice-pro-backend.onrender.com/
- **Health Check:** https://jb-rice-pro-backend.onrender.com/api/health

### Contact Information
- **Developer:** Lawrence Wambugu
- **Project:** JB-Rice-Pro ERP System
- **Version:** 1.0.0

---

*This manual covers the complete JB-Rice-Pro ERP system. For additional support or feature requests, please contact the development team.* 