import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Plus, CheckCircle, XCircle, Clock, Filter, Calendar, Edit2 } from 'lucide-react';
import { ordersAPI, customersAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [formData, setFormData] = useState({
    customer_id: '',
    quantity_kg: ''
  });
  const [editFormData, setEditFormData] = useState({
    customer_id: '',
    quantity_kg: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (periodFilter !== 'all') filters.period = periodFilter;
      
      const [ordersResponse, customersResponse] = await Promise.all([
        ordersAPI.getOrders(filters),
        customersAPI.getCustomers()
      ]);
      setOrders(ordersResponse.data);
      setCustomers(customersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, periodFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.createOrder({
        customer_id: parseInt(formData.customer_id),
        quantity_kg: parseFloat(formData.quantity_kg)
      });
      setShowModal(false);
      setFormData({ customer_id: '', quantity_kg: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please check inventory and quantity.');
    }
  };

  const handleEdit = (order) => {
    if (order.delivery_status !== 'pending') {
      alert('Only pending orders can be edited.');
      return;
    }
    setEditingOrder(order);
    setEditFormData({
      customer_id: order.customer_id.toString(),
      quantity_kg: order.quantity_kg.toString()
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.updateOrder(editingOrder.id, {
        customer_id: parseInt(editFormData.customer_id),
        quantity_kg: parseFloat(editFormData.quantity_kg)
      });
      setShowEditModal(false);
      setEditingOrder(null);
      setEditFormData({ customer_id: '', quantity_kg: '' });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please check inventory and quantity.');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getFilterLabel = (filter) => {
    switch (filter) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Time';
      default: return 'All Time';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'all': return 'All Status';
      default: return 'All Status';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Filters:</strong> Showing {getStatusLabel(statusFilter)} orders for {getFilterLabel(periodFilter).toLowerCase()} ({orders.length} orders)
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No orders found for the selected filters.</p>
            <p className="text-sm">Create your first order to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.delivery_status)}`}>
                        {order.delivery_status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">Customer: {order.customer_name}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium">{order.quantity_kg} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price per kg</p>
                        <p className="font-medium">KES {order.price_per_kg}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-medium">KES {order.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Ordered: {new Date(order.order_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {getStatusIcon(order.delivery_status)}
                    {order.delivery_status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          title="Edit order details"
                        >
                          <Edit2 className="h-4 w-4 inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Mark Delivered
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Order</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customer_type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.quantity_kg}
                    onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                    className="input-field"
                    placeholder="Enter quantity in kg"
                    min="5"
                    step="5"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 5kg, multiples of 5kg only
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Create Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Order</h3>
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Editing:</strong> Order #{editingOrder.id} - {editingOrder.customer_name}
                </p>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <select
                    value={editFormData.customer_id}
                    onChange={(e) => setEditFormData({ ...editFormData, customer_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customer_type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={editFormData.quantity_kg}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity_kg: e.target.value })}
                    className="input-field"
                    placeholder="Enter quantity in kg"
                    min="5"
                    step="5"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 5kg, multiples of 5kg only
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <strong>Note:</strong> Price will be recalculated based on customer type.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Update Order
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingOrder(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 