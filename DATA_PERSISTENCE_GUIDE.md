# JB-Rice-Pro Data Persistence Guide

## 🔍 Why Data Gets Lost

### Render Free Tier Limitations
- **Service Sleep:** After 15 minutes of inactivity, Render puts free services to sleep
- **Database Reset:** SQLite database is reset when service wakes up
- **Session Loss:** User sessions are lost during sleep/wake cycles

### Current Solutions Implemented

#### 1. ✅ Automatic Database Initialization
- Database tables are recreated on every startup
- User accounts are preserved (if using persistent storage)
- Data is automatically reinitialized

#### 2. ✅ Token-Based Authentication
- User authentication uses tokens instead of sessions
- Tokens are stored in localStorage (persistent)
- Authentication survives service restarts

#### 3. ✅ Keep-Alive Mechanism
- `/api/ping` endpoint to prevent service sleep
- Automatic database initialization on health checks
- Timestamp tracking for monitoring

## 🛠️ Solutions to Prevent Data Loss

### Option 1: Run Keep-Alive Script
```bash
# Install requests if not installed
pip install requests

# Run the keep-alive script
python keep_alive.py
```

### Option 2: Use External Monitoring Service
- **UptimeRobot:** Free monitoring service
- **Pingdom:** Website monitoring
- **Cron-job.org:** Free cron job service

### Option 3: Upgrade to Paid Render Plan
- **Paid plans** don't have sleep limitations
- **Persistent storage** for databases
- **Better performance** and reliability

## 📊 Current Data Persistence Status

### ✅ What Persists
- **User Accounts:** Stored in database (survives restarts)
- **Authentication Tokens:** Stored in localStorage
- **Database Schema:** Automatically recreated

### ⚠️ What Gets Lost
- **Inventory Data:** Reset on service restart
- **Customer Data:** Reset on service restart  
- **Order History:** Reset on service restart
- **Session Data:** Lost during sleep cycles

## 🚀 Recommended Actions

### For Development/Testing
1. **Use Keep-Alive Script:** Run `python keep_alive.py`
2. **Frequent Backups:** Export data regularly
3. **Test with Small Data:** Use minimal data for testing

### For Production
1. **Upgrade to Paid Plan:** Render paid plans don't sleep
2. **Use PostgreSQL:** More reliable than SQLite
3. **Implement Backup System:** Regular data exports

## 🔧 Technical Details

### Database Initialization
```python
# Automatic on startup
with app.app_context():
    db.create_all()
    # Create default admin user if needed
```

### Token Authentication
```javascript
// Frontend stores token
const userData = {
  id: user.id,
  username: user.username,
  token: response.data.token
};
localStorage.setItem('user', JSON.stringify(userData));
```

### Keep-Alive Endpoint
```python
@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({
        'status': 'alive',
        'timestamp': get_eat_time().isoformat()
    })
```

## 📞 Support Options

### Immediate Solutions
1. **Run keep-alive script** to prevent sleep
2. **Recreate data** after each restart
3. **Use default admin account** for testing

### Long-term Solutions
1. **Upgrade Render plan** for persistent storage
2. **Migrate to PostgreSQL** for better reliability
3. **Implement backup system** for data protection

## 🎯 Best Practices

### For Users
- **Save important data** before service restarts
- **Use keep-alive script** during active development
- **Recreate data** after each restart

### For Developers
- **Test with minimal data** during development
- **Implement data export** functionality
- **Consider paid hosting** for production use

---

*This guide explains the data persistence limitations and provides solutions for the JB-Rice-Pro ERP system.* 