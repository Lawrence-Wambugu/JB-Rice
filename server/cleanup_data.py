#!/usr/bin/env python3
"""
Cleanup script for JB-Rice-Pro
This script will clear all inventory and orders data while preserving:
- User accounts (for authentication)
- Customer records (for business relationships)
- Database structure
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app_sqlite import app, db, Inventory, Order

def cleanup_data():
    """Clean up inventory and orders data"""
    with app.app_context():
        try:
            print("🧹 Starting data cleanup for JB-Rice-Pro...")
            
            # Get current counts
            inventory_count = Inventory.query.count()
            orders_count = Order.query.count()
            
            print(f"📊 Current data:")
            print(f"   - Inventory records: {inventory_count}")
            print(f"   - Orders: {orders_count}")
            
            if inventory_count == 0 and orders_count == 0:
                print("✅ Database is already clean!")
                return
            
            # Confirm with user
            response = input(f"\n⚠️  This will delete {inventory_count} inventory records and {orders_count} orders.\nAre you sure you want to continue? (yes/no): ")
            
            if response.lower() != 'yes':
                print("❌ Cleanup cancelled.")
                return
            
            # Delete inventory records
            if inventory_count > 0:
                print(f"🗑️  Deleting {inventory_count} inventory records...")
                Inventory.query.delete()
                print("✅ Inventory records deleted.")
            
            # Delete orders
            if orders_count > 0:
                print(f"🗑️  Deleting {orders_count} orders...")
                Order.query.delete()
                print("✅ Orders deleted.")
            
            # Commit changes
            db.session.commit()
            
            # Verify cleanup
            final_inventory_count = Inventory.query.count()
            final_orders_count = Order.query.count()
            
            print(f"\n✅ Cleanup completed successfully!")
            print(f"📊 Final data:")
            print(f"   - Inventory records: {final_inventory_count}")
            print(f"   - Orders: {final_orders_count}")
            print(f"\n🎉 Your JB-Rice-Pro is now ready for fresh data!")
            print(f"💡 You can now start adding new inventory and creating orders.")
            
        except Exception as e:
            print(f"❌ Error during cleanup: {str(e)}")
            db.session.rollback()

if __name__ == "__main__":
    cleanup_data() 