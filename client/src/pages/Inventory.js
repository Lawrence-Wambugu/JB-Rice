import React, { useState, useEffect } from 'react';
import { Package, Plus, TrendingUp, AlertTriangle, Clock, Calendar, Filter, Edit2 } from 'lucide-react';
import { inventoryAPI } from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState({});
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [formData, setFormData] = useState({
    bags: '',
    cost_per_bag: 9000
  });
  const [editFormData, setEditFormData] = useState({
    bags: '',
    cost_per_bag: 9000
  });

  useEffect(() => {
    fetchInventory();
    fetchInventoryHistory();
  }, [filterPeriod]);

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryHistory = async () => {
    try {
      const response = await inventoryAPI.getInventoryHistory(filterPeriod);
      setInventoryHistory(response.data);
    } catch (error) {
      console.error('Error fetching inventory history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.addInventory({
        bags: parseInt(formData.bags),
        cost_per_bag: parseFloat(formData.cost_per_bag)
      });
      setShowAddModal(false);
      setFormData({ bags: '', cost_per_bag: 9000 });
      fetchInventory();
      fetchInventoryHistory();
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditFormData({
      bags: record.bags_added.toString(),
      cost_per_bag: record.cost_per_bag
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.updateInventory(editingRecord.id, {
        bags: parseInt(editFormData.bags),
        cost_per_bag: parseFloat(editFormData.cost_per_bag)
      });
      setShowEditModal(false);
      setEditingRecord(null);
      setEditFormData({ bags: '', cost_per_bag: 9000 });
      fetchInventory();
      fetchInventoryHistory();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const getStockStatus = (availableKg) => {
    if (availableKg <= 100) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Low Stock' };
    if (availableKg <= 500) return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Medium Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'Good Stock' };
  };

  const getFilterLabel = (period) => {
    switch (period) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Time';
      default: return 'All Time';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stockStatus = getStockStatus(inventory.available_kg || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage rice stock levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Stock</p>
              <p className="text-3xl font-bold text-gray-900">
                {inventory.available_kg || 0} kg
              </p>
              <p className="text-sm text-gray-500">
                {inventory.available_bags || 0} bags
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Purchased</p>
              <p className="text-3xl font-bold text-gray-900">
                {inventory.total_kg_added || 0} kg
              </p>
              <p className="text-sm text-gray-500">
                {inventory.total_bags_added || 0} bags
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Status</p>
              <p className={`text-2xl font-bold ${stockStatus.color}`}>
                {stockStatus.text}
              </p>
              <p className="text-sm text-gray-500">
                {inventory.available_kg || 0} kg remaining
              </p>
            </div>
            <div className={`p-3 rounded-full ${stockStatus.bg}`}>
              <AlertTriangle className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Available Stock</p>
            <p className="text-2xl font-bold text-gray-900">{inventory.available_kg || 0} kg</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Total Purchased</p>
            <p className="text-2xl font-bold text-gray-900">{inventory.total_kg_added || 0} kg</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Total Sold</p>
            <p className="text-2xl font-bold text-gray-900">{inventory.total_sold_kg || 0} kg</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Available Bags</p>
            <p className="text-2xl font-bold text-gray-900">{inventory.available_bags || 0}</p>
          </div>
        </div>
      </div>

      {/* Inventory History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Stock Addition History</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Timestamps of when stock was added</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
        
        {inventoryHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No stock additions recorded for {getFilterLabel(filterPeriod).toLowerCase()}.</p>
            <p className="text-sm">Add your first stock to see the history here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Filter:</strong> Showing {getFilterLabel(filterPeriod)} ({inventoryHistory.length} records)
              </p>
            </div>
            {inventoryHistory.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Package className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.bags_added} bags ({record.total_kg} kg) added
                    </p>
                    <p className="text-sm text-gray-600">
                      Cost: KES {record.cost_per_bag.toLocaleString()} per bag
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{record.formatted_date}</span>
                  </div>
                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit this record"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Stock</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bags (60kg each)
                  </label>
                  <input
                    type="number"
                    value={formData.bags}
                    onChange={(e) => setFormData({ ...formData, bags: e.target.value })}
                    className="input-field"
                    placeholder="Enter number of bags"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Bag (KES)
                  </label>
                  <input
                    type="number"
                    value={formData.cost_per_bag}
                    onChange={(e) => setFormData({ ...formData, cost_per_bag: e.target.value })}
                    className="input-field"
                    placeholder="9000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> This stock addition will be timestamped automatically.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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

      {/* Edit Stock Modal */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Stock Record</h3>
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Editing:</strong> Record from {editingRecord.formatted_date}
                </p>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bags (60kg each)
                  </label>
                  <input
                    type="number"
                    value={editFormData.bags}
                    onChange={(e) => setEditFormData({ ...editFormData, bags: e.target.value })}
                    className="input-field"
                    placeholder="Enter number of bags"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Bag (KES)
                  </label>
                  <input
                    type="number"
                    value={editFormData.cost_per_bag}
                    onChange={(e) => setEditFormData({ ...editFormData, cost_per_bag: e.target.value })}
                    className="input-field"
                    placeholder="9000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <strong>Warning:</strong> This will update the inventory calculations.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Update Record
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingRecord(null);
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

export default Inventory; 