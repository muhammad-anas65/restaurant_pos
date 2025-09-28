import React, { useState, useEffect } from 'react';
import { ChartBar as BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import api from '../services/api';

interface DailySalesReport {
  date: string;
  summary: {
    total_orders: number;
    total_revenue: string;
    tables_served: number;
    average_order_value: string;
  };
  bestSellingItems: Array<{
    name: string;
    category: string;
    total_quantity: number;
    total_revenue: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    items_sold: number;
    total_quantity: number;
    total_revenue: string;
  }>;
  paymentMethods: Array<{
    payment_method: string;
    transactions: number;
    total_amount: string;
  }>;
}

const Reports: React.FC = () => {
  const [dailyReport, setDailyReport] = useState<DailySalesReport | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyReport();
  }, [selectedDate]);

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/daily?date=${selectedDate}`);
      setDailyReport(response.data);
    } catch (error) {
      console.error('Failed to fetch daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dailyReport) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try selecting a different date.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyReport.summary.total_orders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${parseFloat(dailyReport.summary.total_revenue || '0').toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${parseFloat(dailyReport.summary.average_order_value || '0').toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tables Served</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyReport.summary.tables_served}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Selling Items */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Best Selling Items</h3>
          </div>
          <div className="p-6">
            {dailyReport.bestSellingItems.length > 0 ? (
              <div className="space-y-4">
                {dailyReport.bestSellingItems.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.total_quantity} sold
                      </p>
                      <p className="text-xs text-gray-500">
                        ${parseFloat(item.total_revenue).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No sales data available</p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Sales by Category</h3>
          </div>
          <div className="p-6">
            {dailyReport.categoryBreakdown.length > 0 ? (
              <div className="space-y-4">
                {dailyReport.categoryBreakdown.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${parseFloat(category.total_revenue).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (parseFloat(category.total_revenue) / 
                             Math.max(...dailyReport.categoryBreakdown.map(c => parseFloat(c.total_revenue)))) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.total_quantity} items</span>
                      <span>{category.items_sold} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
        </div>
        <div className="p-6">
          {dailyReport.paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dailyReport.paymentMethods.map((method, index) => (
                <div key={index} className="text-center">
                  <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 capitalize mb-2">
                    {method.payment_method}
                  </h4>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    ${parseFloat(method.total_amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {method.transactions} transaction{method.transactions !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No payment data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;