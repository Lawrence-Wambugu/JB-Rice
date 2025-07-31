from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta
import os
import re
import secrets
from dotenv import load_dotenv
import pytz

load_dotenv()

# Timezone function
def get_eat_time():
    """Get current time in East Africa Time (EAT)"""
    eat_tz = pytz.timezone('Africa/Nairobi')
    return datetime.now(eat_tz)

app = Flask(__name__)

# Database configuration - use SQLite by default, PostgreSQL in production
database_url = os.getenv('DATABASE_URL')

# For now, always use SQLite to avoid psycopg2 issues
database_url = 'sqlite:///mwearicepro.db'

# If you want to use PostgreSQL later, uncomment these lines:
# if database_url and database_url.startswith('postgres://'):
#     database_url = database_url.replace('postgres://', 'postgresql://', 1)
# elif not database_url:
#     database_url = 'sqlite:///mwearicepro.db'

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    reset_token = db.Column(db.String(255))
    reset_token_expiry = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=get_eat_time)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    customer_type = db.Column(db.String(20), nullable=False)  # 'restaurant' or 'individual'
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=get_eat_time)
    user = db.relationship('User', backref='customers')

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bags_added = db.Column(db.Integer, nullable=False)
    total_kg = db.Column(db.Float, nullable=False)
    cost_per_bag = db.Column(db.Float, default=9000.0)  # KES 9,000 per 60kg bag
    date_added = db.Column(db.DateTime, default=get_eat_time)
    user = db.relationship('User', backref='inventory_records')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    quantity_kg = db.Column(db.Float, nullable=False)
    price_per_kg = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    order_date = db.Column(db.DateTime, default=get_eat_time)
    delivery_status = db.Column(db.String(20), default='pending')  # pending, delivered, cancelled
    delivery_date = db.Column(db.DateTime)
    user = db.relationship('User', backref='orders')
    customer = db.relationship('Customer', backref='orders')

# Password validation function
def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    
    return True, "Password is valid"

# Simple password hashing (in production, use bcrypt)
def hash_password(password):
    return f"hashed_{password}"  # Simple hash for demo

def verify_password(password, hashed):
    return hashed == f"hashed_{password}"

# Session management for user isolation using request headers
def get_current_user_id():
    """Get user ID from request headers"""
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        user_id = auth_header.split(' ')[1]
        try:
            return int(user_id)
        except ValueError:
            return None
    return None

def set_current_user_id(user_id):
    """This is handled by the frontend now"""
    pass

# Authentication routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        
        # Validation
        if not all([username, email, phone, password, confirm_password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        if password != confirm_password:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        # Password validation
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create user
        user = User(
            username=username,
            email=email,
            phone=phone,
            password_hash=hash_password(password)
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/signin', methods=['POST'])
def signin():
    """User login"""
    try:
        data = request.get_json()
        username_or_email = data.get('username_or_email', '').strip()
        password = data.get('password', '')
        
        if not username_or_email or not password:
            return jsonify({'error': 'Username/email and password are required'}), 400
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()
        
        if not user or not verify_password(password, user.password_hash):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'token': str(user.id)  # Simple token for demo
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Email not found'}), 404
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expiry = get_eat_time() + timedelta(hours=1)
        
        db.session.commit()
        
        # In production, send email here
        # For demo, just return the token
        return jsonify({
            'message': 'Password reset link sent to your email',
            'reset_token': reset_token  # Remove this in production
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset password using token"""
    try:
        data = request.get_json()
        token = data.get('token', '').strip()
        new_password = data.get('new_password', '')
        confirm_password = data.get('confirm_password', '')
        
        if not all([token, new_password, confirm_password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        if new_password != confirm_password:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        # Password validation
        is_valid, message = validate_password(new_password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Find user by token
        user = User.query.filter_by(reset_token=token).first()
        
        if not user:
            return jsonify({'error': 'Invalid reset token'}), 400
        
        if user.reset_token_expiry < get_eat_time():
            return jsonify({'error': 'Reset token has expired'}), 400
        
        # Update password
        user.password_hash = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        
        db.session.commit()
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Root route for testing
@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    # Auto-initialize database if tables don't exist
    try:
        with app.app_context():
            db.create_all()
        return jsonify({
            'message': 'JB-Rice-Pro API is running', 
            'endpoints': '/api/*',
            'database': 'initialized',
            'timestamp': get_eat_time().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'message': 'JB-Rice-Pro API is running', 
            'endpoints': '/api/*',
            'database': f'error: {str(e)}',
            'timestamp': get_eat_time().isoformat()
        }), 200

# Keep-alive endpoint to prevent service sleeping
@app.route('/api/ping', methods=['GET'])
def ping():
    """Keep-alive endpoint"""
    return jsonify({
        'status': 'alive',
        'timestamp': get_eat_time().isoformat()
    }), 200

# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Ensure database is initialized
        with app.app_context():
            db.create_all()
        return jsonify({
            'status': 'healthy', 
            'message': 'JB-Rice-Pro API is running',
            'database': 'initialized'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'warning', 
            'message': 'JB-Rice-Pro API is running',
            'database': f'error: {str(e)}'
        }), 200

# Routes
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    """Get current inventory status"""
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401
        
        # Calculate current stock for this user
        total_bags_added = db.session.query(db.func.sum(Inventory.bags_added)).filter(
            Inventory.user_id == user_id
        ).scalar() or 0
        total_kg_added = db.session.query(db.func.sum(Inventory.total_kg)).filter(
            Inventory.user_id == user_id
        ).scalar() or 0
        
        # Calculate sold kg for this user
        total_sold_kg = db.session.query(db.func.sum(Order.quantity_kg)).filter(
            Order.user_id == user_id,
            Order.delivery_status == 'delivered'
        ).scalar() or 0
        
        available_kg = total_kg_added - total_sold_kg
        available_bags = available_kg / 60  # 60kg per bag
        
        return jsonify({
            'available_kg': round(available_kg, 2),
            'available_bags': round(available_bags, 2),
            'total_bags_added': total_bags_added,
            'total_kg_added': total_kg_added,
            'total_sold_kg': total_sold_kg
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/inventory/history', methods=['GET'])
def get_inventory_history():
    """Get inventory history with timestamps and filtering"""
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401
        
        period = request.args.get('period', 'all')  # week, month, all
        end_date = get_eat_time()
        
        if period == 'week':
            start_date = end_date - timedelta(days=7)
            query = Inventory.query.filter(
                Inventory.user_id == user_id,
                Inventory.date_added >= start_date
            )
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
            query = Inventory.query.filter(
                Inventory.user_id == user_id,
                Inventory.date_added >= start_date
            )
        else:  # all
            query = Inventory.query.filter(Inventory.user_id == user_id)
        
        inventory_records = query.order_by(Inventory.date_added.desc()).all()
        
        return jsonify([{
            'id': record.id,
            'bags_added': record.bags_added,
            'total_kg': record.total_kg,
            'cost_per_bag': record.cost_per_bag,
            'date_added': record.date_added.isoformat(),
            'formatted_date': record.date_added.strftime('%B %d, %Y at %I:%M %p')
        } for record in inventory_records])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    """Add new rice bags to inventory"""
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401
        
        data = request.get_json()
        bags = data.get('bags', 0)
        cost_per_bag = data.get('cost_per_bag', 9000.0)
        
        if bags <= 0:
            return jsonify({'error': 'Number of bags must be positive'}), 400
        
        total_kg = bags * 60  # 60kg per bag
        
        new_inventory = Inventory(
            user_id=user_id,
            bags_added=bags,
            total_kg=total_kg,
            cost_per_bag=cost_per_bag
        )
        
        db.session.add(new_inventory)
        db.session.commit()
        
        return jsonify({'message': f'Added {bags} bags ({total_kg}kg) to inventory'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/inventory/<int:inventory_id>', methods=['PUT'])
def update_inventory(inventory_id):
    """Update inventory record"""
    try:
        inventory = Inventory.query.get_or_404(inventory_id)
        data = request.get_json()
        
        bags = data.get('bags', inventory.bags_added)
        cost_per_bag = data.get('cost_per_bag', inventory.cost_per_bag)
        
        if bags <= 0:
            return jsonify({'error': 'Number of bags must be positive'}), 400
        
        total_kg = bags * 60  # 60kg per bag
        
        inventory.bags_added = bags
        inventory.total_kg = total_kg
        inventory.cost_per_bag = cost_per_bag
        
        db.session.commit()
        
        return jsonify({
            'message': f'Updated inventory record: {bags} bags ({total_kg}kg)',
            'inventory': {
                'id': inventory.id,
                'bags_added': inventory.bags_added,
                'total_kg': inventory.total_kg,
                'cost_per_bag': inventory.cost_per_bag,
                'date_added': inventory.date_added.isoformat(),
                'formatted_date': inventory.date_added.strftime('%B %d, %Y at %I:%M %p')
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Get all customers with optional filtering"""
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401
        
        customer_type = request.args.get('type')
        query = Customer.query.filter(Customer.user_id == user_id)
        
        if customer_type:
            query = query.filter_by(customer_type=customer_type)
        
        customers = query.order_by(Customer.created_at.desc()).all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'phone': c.phone,
            'email': c.email,
            'customer_type': c.customer_type,
            'address': c.address,
            'created_at': c.created_at.isoformat()
        } for c in customers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers', methods=['POST'])
def add_customer():
    """Add new customer"""
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401
        
        data = request.get_json()
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        email = data.get('email', '').strip()
        customer_type = data.get('customer_type', 'individual')
        address = data.get('address', '').strip()
        
        if not name or not phone:
            return jsonify({'error': 'Name and phone are required'}), 400
        
        if customer_type not in ['restaurant', 'individual']:
            return jsonify({'error': 'Customer type must be restaurant or individual'}), 400
        
        new_customer = Customer(
            user_id=user_id,
            name=name,
            phone=phone,
            email=email,
            customer_type=customer_type,
            address=address
        )
        
        db.session.add(new_customer)
        db.session.commit()
        
        return jsonify({'message': 'Customer added successfully', 'id': new_customer.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update customer"""
    try:
        customer = Customer.query.get_or_404(customer_id)
        data = request.get_json()
        
        customer.name = data.get('name', customer.name)
        customer.phone = data.get('phone', customer.phone)
        customer.email = data.get('email', customer.email)
        customer.customer_type = data.get('customer_type', customer.customer_type)
        customer.address = data.get('address', customer.address)
        
        db.session.commit()
        
        return jsonify({'message': 'Customer updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """Delete customer"""
    try:
        customer = Customer.query.get_or_404(customer_id)
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({'message': 'Customer deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders with optional filtering"""
    try:
        status = request.args.get('status')
        customer_id = request.args.get('customer_id')
        period = request.args.get('period', 'all')  # week, month, all
        end_date = get_eat_time()
        
        query = Order.query
        
        # Apply period filter
        if period == 'week':
            start_date = end_date - timedelta(days=7)
            query = query.filter(Order.order_date >= start_date)
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
            query = query.filter(Order.order_date >= start_date)
        # 'all' doesn't add any date filter
        
        # Apply other filters
        if status:
            query = query.filter_by(delivery_status=status)
        if customer_id:
            query = query.filter_by(customer_id=customer_id)
        
        orders = query.order_by(Order.order_date.desc()).all()
        return jsonify([{
            'id': o.id,
            'customer_id': o.customer_id,
            'customer_name': o.customer.name,
            'quantity_kg': o.quantity_kg,
            'price_per_kg': o.price_per_kg,
            'total_amount': o.total_amount,
            'order_date': o.order_date.isoformat(),
            'delivery_status': o.delivery_status,
            'delivery_date': o.delivery_date.isoformat() if o.delivery_date else None
        } for o in orders])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create new order"""
    try:
        data = request.get_json()
        customer_id = data.get('customer_id')
        quantity_kg = data.get('quantity_kg', 0)
        
        if quantity_kg < 5 or quantity_kg % 5 != 0:
            return jsonify({'error': 'Quantity must be at least 5kg and in multiples of 5kg'}), 400
        
        customer = Customer.query.get_or_404(customer_id)
        price_per_kg = 180 if customer.customer_type == 'restaurant' else 200
        total_amount = quantity_kg * price_per_kg
        
        # Check inventory
        inventory = get_inventory().get_json()
        if inventory['available_kg'] < quantity_kg:
            return jsonify({'error': 'Insufficient inventory'}), 400
        
        new_order = Order(
            customer_id=customer_id,
            quantity_kg=quantity_kg,
            price_per_kg=price_per_kg,
            total_amount=total_amount
        )
        
        db.session.add(new_order)
        db.session.commit()
        
        return jsonify({'message': 'Order created successfully', 'id': new_order.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order delivery status"""
    try:
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'delivered', 'cancelled']:
            return jsonify({'error': 'Invalid status'}), 400
        
        order.delivery_status = new_status
        if new_status == 'delivered':
            order.delivery_date = get_eat_time()
        
        db.session.commit()
        return jsonify({'message': 'Order status updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    """Update order details (only for pending orders)"""
    try:
        order = Order.query.get_or_404(order_id)

        # Only allow editing pending orders
        if order.delivery_status != 'pending':
            return jsonify({'error': 'Only pending orders can be edited'}), 400

        data = request.get_json()
        customer_id = data.get('customer_id', order.customer_id)
        quantity_kg = data.get('quantity_kg', order.quantity_kg)

        if quantity_kg < 5 or quantity_kg % 5 != 0:
            return jsonify({'error': 'Quantity must be at least 5kg and in multiples of 5kg'}), 400

        # Get customer to determine price
        customer = Customer.query.get_or_404(customer_id)
        price_per_kg = 180 if customer.customer_type == 'restaurant' else 200
        total_amount = quantity_kg * price_per_kg

        # Check inventory
        inventory = get_inventory().get_json()
        if inventory['available_kg'] < quantity_kg:
            return jsonify({'error': 'Insufficient inventory'}), 400

        order.customer_id = customer_id
        order.quantity_kg = quantity_kg
        order.price_per_kg = price_per_kg
        order.total_amount = total_amount

        db.session.commit()

        return jsonify({
            'message': 'Order updated successfully',
            'order': {
                'id': order.id,
                'customer_id': order.customer_id,
                'customer_name': order.customer.name,
                'quantity_kg': order.quantity_kg,
                'price_per_kg': order.price_per_kg,
                'total_amount': order.total_amount,
                'order_date': order.order_date.isoformat(),
                'delivery_status': order.delivery_status
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports/sales', methods=['GET'])
def get_sales_report():
    """Get sales report for specified period"""
    try:
        period = request.args.get('period', 'month')  # day, week, month
        end_date = get_eat_time()
        
        if period == 'day':
            start_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'week':
            start_date = end_date - timedelta(days=7)
        else:  # month
            start_date = end_date - timedelta(days=30)
        
        orders = Order.query.filter(
            Order.order_date >= start_date,
            Order.order_date <= end_date,
            Order.delivery_status == 'delivered'
        ).all()
        
        total_revenue = sum(order.total_amount for order in orders)
        total_kg_sold = sum(order.quantity_kg for order in orders)
        
        # Calculate cost of goods sold
        cost_per_kg = 150  # KES 150 per kg (9000/60)
        total_cost = total_kg_sold * cost_per_kg
        profit = total_revenue - total_cost
        
        # Customer breakdown
        restaurant_orders = [o for o in orders if o.customer.customer_type == 'restaurant']
        individual_orders = [o for o in orders if o.customer.customer_type == 'individual']
        
        return jsonify({
            'period': period,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'total_orders': len(orders),
            'total_revenue': total_revenue,
            'total_kg_sold': total_kg_sold,
            'total_cost': total_cost,
            'profit': profit,
            'restaurant_orders': len(restaurant_orders),
            'individual_orders': len(individual_orders),
            'restaurant_revenue': sum(o.total_amount for o in restaurant_orders),
            'individual_revenue': sum(o.total_amount for o in individual_orders)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/init-db', methods=['POST'])
def init_database():
    """Initialize database tables"""
    try:
        with app.app_context():
            # Drop all tables first to ensure clean slate
            db.drop_all()
            # Create all tables
            db.create_all()
            # Get list of created tables
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
        return jsonify({
            'message': 'Database initialized successfully',
            'tables_created': tables
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports/inventory', methods=['GET'])
def get_inventory_report():
    """Get detailed inventory report"""
    try:
        inventory_records = Inventory.query.order_by(Inventory.date_added.desc()).all()
        
        total_bags = sum(record.bags_added for record in inventory_records)
        total_kg = sum(record.total_kg for record in inventory_records)
        total_cost = sum(record.bags_added * record.cost_per_bag for record in inventory_records)
        
        # Calculate sold inventory
        delivered_orders = Order.query.filter_by(delivery_status='delivered').all()
        sold_kg = sum(order.quantity_kg for order in delivered_orders)
        sold_revenue = sum(order.total_amount for order in delivered_orders)
        
        available_kg = total_kg - sold_kg
        cost_of_sold = sold_kg * 150  # KES 150 per kg
        profit = sold_revenue - cost_of_sold
        
        return jsonify({
            'total_bags_purchased': total_bags,
            'total_kg_purchased': total_kg,
            'total_purchase_cost': total_cost,
            'sold_kg': sold_kg,
            'sold_revenue': sold_revenue,
            'available_kg': available_kg,
            'cost_of_sold': cost_of_sold,
            'profit': profit,
            'inventory_records': [{
                'id': record.id,
                'bags_added': record.bags_added,
                'total_kg': record.total_kg,
                'cost_per_bag': record.cost_per_bag,
                'date_added': record.date_added.isoformat()
            } for record in inventory_records]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database on startup
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables created successfully")
        
        # Create a default admin user if no users exist
        if User.query.count() == 0:
            admin_user = User(
                username='admin',
                email='admin@jb-rice-pro.com',
                phone='123456789',
                password_hash=hash_password('Admin123!')
            )
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Default admin user created")
            
    except Exception as e:
        print(f"⚠️ Database initialization error: {e}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 