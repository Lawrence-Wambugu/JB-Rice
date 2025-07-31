import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    restaurant_price: 180,
    individual_price: 200,
    bag_cost: 9000,
    bag_weight: 60,
    min_order: 5
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleReset = () => {
    setSettings({
      restaurant_price: 180,
      individual_price: 200,
      bag_cost: 9000,
      bag_weight: 60,
      min_order: 5
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure system parameters and pricing</p>
        </div>
        <div className="flex items-center space-x-2 text-primary-600">
          <SettingsIcon className="h-8 w-8" />
          <span className="text-lg font-semibold">System Configuration</span>
        </div>
      </div>

      {/* Settings Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pricing Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Price (KES/kg)
                </label>
                <input
                  type="number"
                  value={settings.restaurant_price}
                  onChange={(e) => setSettings({ ...settings, restaurant_price: parseFloat(e.target.value) })}
                  className="input-field"
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Price per kg for restaurant customers</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Individual Price (KES/kg)
                </label>
                <input
                  type="number"
                  value={settings.individual_price}
                  onChange={(e) => setSettings({ ...settings, individual_price: parseFloat(e.target.value) })}
                  className="input-field"
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Price per kg for individual customers</p>
              </div>
            </div>
          </div>

          {/* Inventory Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bag Cost (KES)
                </label>
                <input
                  type="number"
                  value={settings.bag_cost}
                  onChange={(e) => setSettings({ ...settings, bag_cost: parseFloat(e.target.value) })}
                  className="input-field"
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Cost per 60kg bag from farmers</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bag Weight (kg)
                </label>
                <input
                  type="number"
                  value={settings.bag_weight}
                  onChange={(e) => setSettings({ ...settings, bag_weight: parseFloat(e.target.value) })}
                  className="input-field"
                  min="1"
                  step="0.1"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Weight per bag in kilograms</p>
              </div>
            </div>
          </div>

          {/* Order Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order (kg)
                </label>
                <input
                  type="number"
                  value={settings.min_order}
                  onChange={(e) => setSettings({ ...settings, min_order: parseFloat(e.target.value) })}
                  className="input-field"
                  min="1"
                  step="1"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Minimum order quantity in kilograms</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Increment (kg)
                </label>
                <input
                  type="number"
                  value="5"
                  className="input-field bg-gray-100"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">Orders must be in multiples of this value</p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">System Version:</span>
                <span className="text-sm text-gray-900">MweaRicePro v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Database:</span>
                <span className="text-sm text-gray-900">PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Backend:</span>
                <span className="text-sm text-gray-900">Flask Python</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Frontend:</span>
                <span className="text-sm text-gray-900">React.js</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Pricing Guidelines</h4>
            <p className="text-sm text-blue-800">
              • Restaurant customers get discounted pricing (KES 180/kg)<br/>
              • Individual customers pay standard pricing (KES 200/kg)<br/>
              • Prices can be adjusted based on market conditions
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Inventory Management</h4>
            <p className="text-sm text-green-800">
              • Each bag contains 60kg of rice<br/>
              • Cost per bag is typically KES 9,000<br/>
              • System automatically tracks available stock
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Order Requirements</h4>
            <p className="text-sm text-yellow-800">
              • Minimum order quantity: 5kg<br/>
              • Orders must be in multiples of 5kg<br/>
              • System validates inventory before order creation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 