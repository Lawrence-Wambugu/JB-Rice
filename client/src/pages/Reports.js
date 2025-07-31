import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { reportsAPI } from '../services/api';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [salesReport, setSalesReport] = useState({});
  const [inventoryReport, setInventoryReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  const fetchReports = useCallback(async () => {
    try {
      const [salesResponse, inventoryResponse] = await Promise.all([
        reportsAPI.getSalesReport(period),
        reportsAPI.getInventoryReport()
      ]);
      setSalesReport(salesResponse.data);
      setInventoryReport(inventoryResponse.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const salesData = {
    labels: ['Restaurants', 'Individuals'],
    datasets: [
      {
        label: 'Revenue (KES)',
        data: [
          salesReport.restaurant_revenue || 0,
          salesReport.individual_revenue || 0
        ],
        backgroundColor: ['#16a34a', '#f59e0b'],
        borderColor: ['#15803d', '#d97706'],
        borderWidth: 1,
      },
    ],
  };

  const profitData = {
    labels: ['Revenue', 'Cost', 'Profit'],
    datasets: [
      {
        data: [
          salesReport.total_revenue || 0,
          salesReport.total_cost || 0,
          salesReport.profit || 0
        ],
        backgroundColor: ['#16a34a', '#ef4444', '#3b82f6'],
        borderWidth: 0,
      },
    ],
  };

  const monthlyTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue (KES)',
        data: [45000, 52000, 48000, 61000],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
      },
    ],
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
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Sales reports and business insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field w-32"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                KES {(salesReport.total_revenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">
                {salesReport.total_orders || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-3xl font-bold text-gray-900">
                KES {(salesReport.profit || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rice Sold</p>
              <p className="text-3xl font-bold text-gray-900">
                {(salesReport.total_kg_sold || 0).toLocaleString()} kg
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Customer Type */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Customer Type</h3>
          <div className="h-64">
            <Bar 
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Profit Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Analysis</h3>
          <div className="h-64">
            <Doughnut 
              data={profitData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Restaurant Orders</p>
                <p className="text-sm text-gray-600">{salesReport.restaurant_orders || 0} orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  KES {(salesReport.restaurant_revenue || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {salesReport.restaurant_orders ? Math.round((salesReport.restaurant_orders / salesReport.total_orders) * 100) : 0}% of total
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Individual Orders</p>
                <p className="text-sm text-gray-600">{salesReport.individual_orders || 0} orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  KES {(salesReport.individual_revenue || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {salesReport.individual_orders ? Math.round((salesReport.individual_orders / salesReport.total_orders) * 100) : 0}% of total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Total Purchased</p>
                <p className="text-sm text-gray-600">{(inventoryReport.total_kg_purchased || 0).toLocaleString()} kg</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  KES {(inventoryReport.total_purchase_cost || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Available Stock</p>
                <p className="text-sm text-gray-600">{(inventoryReport.available_kg || 0).toLocaleString()} kg</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  KES {((inventoryReport.available_kg || 0) * 150).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">@ KES 150/kg</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Total Sold</p>
                <p className="text-sm text-gray-600">{(inventoryReport.sold_kg || 0).toLocaleString()} kg</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  KES {(inventoryReport.sold_revenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
        <div className="h-64">
          <Line 
            data={monthlyTrendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports; 