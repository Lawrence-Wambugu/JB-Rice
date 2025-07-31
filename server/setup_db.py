#!/usr/bin/env python3
"""
Database setup script for MweaRicePro ERP System
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the SQLite version of the app
from app_sqlite import app, db

def setup_database():
    """Initialize the database and create tables"""
    print("🗄️  Setting up MweaRicePro Database (SQLite)...")
    
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("✅ Database tables created successfully!")
            
            # Add some sample data
            from app_sqlite import Customer, Inventory
            
            # Check if we already have data
            if Customer.query.count() == 0:
                print("📝 Adding sample customers...")
                
                # Add sample customers
                sample_customers = [
                    Customer(
                        name="Davana Hotel",
                        phone="+254700123456",
                        email="info@davanahotel.com",
                        customer_type="restaurant",
                        address="Mwea Town, Kirinyaga County"
                    ),
                    Customer(
                        name="La Enzi Club",
                        phone="+254700654321",
                        email="contact@laenziclub.com",
                        customer_type="restaurant",
                        address="Mwea Town, Kirinyaga County"
                    ),
                    Customer(
                        name="John Doe",
                        phone="+254700111111",
                        email="john.doe@email.com",
                        customer_type="individual",
                        address="Mwea Town, Kirinyaga County"
                    ),
                    Customer(
                        name="Jane Smith",
                        phone="+254700222222",
                        email="jane.smith@email.com",
                        customer_type="individual",
                        address="Mwea Town, Kirinyaga County"
                    )
                ]
                
                for customer in sample_customers:
                    db.session.add(customer)
                
                db.session.commit()
                print("✅ Sample customers added successfully!")
            
            if Inventory.query.count() == 0:
                print("📦 Adding sample inventory...")
                
                # Add sample inventory (10 bags = 600kg)
                sample_inventory = Inventory(
                    bags_added=10,
                    total_kg=600,
                    cost_per_bag=9000.0
                )
                
                db.session.add(sample_inventory)
                db.session.commit()
                print("✅ Sample inventory added successfully!")
            
            print("\n🎉 Database setup completed successfully!")
            print("📊 Sample data added:")
            print("   - 4 customers (2 restaurants, 2 individuals)")
            print("   - 10 bags of rice (600kg total)")
            print("   - Cost: KES 90,000")
            print("\n💾 Database file: mwearicepro.db")
            
        except Exception as e:
            print(f"❌ Error setting up database: {e}")
            return False
    
    return True

if __name__ == "__main__":
    setup_database() 