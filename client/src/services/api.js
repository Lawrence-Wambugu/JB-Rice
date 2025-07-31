import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory API
export const inventoryAPI = {
  getInventory: () => api.get('/inventory'),
  addInventory: (data) => api.post('/inventory', data),
  getInventoryHistory: (period = 'all') => api.get(`/inventory/history?period=${period}`),
  updateInventory: (id, data) => api.put(`/inventory/${id}`, data)
};

// Customers API
export const customersAPI = {
  getCustomers: (type) => api.get('/customers', { params: { type } }),
  addCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

// Orders API
export const ordersAPI = {
  getOrders: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.customer_id) params.append('customer_id', filters.customer_id);
    if (filters.period) params.append('period', filters.period);
    return api.get(`/orders?${params.toString()}`);
  },
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (orderId, data) => api.put(`/orders/${orderId}`, data),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status })
};

// Reports API
export const reportsAPI = {
  getSalesReport: (period) => api.get('/reports/sales', { params: { period } }),
  getInventoryReport: () => api.get('/reports/inventory'),
};

export default api; 