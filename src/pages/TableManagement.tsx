import React, { useState, useEffect } from 'react';
import { Plus, Users, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Table {
  id: number;
  table_number: number;
  capacity: number;
  status: string;
  current_order_id?: number;
  current_order_total?: string;
}

const TableManagement: React.FC = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data.tables || []);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cleaning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5" />;
      case 'occupied':
        return <Clock className="h-5 w-5" />;
      case 'reserved':
        return <AlertCircle className="h-5 w-5" />;
      case 'cleaning':
        return <Users className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
        {user?.role === 'admin' && (
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {tables.filter(t => t.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Occupied</p>
              <p className="text-2xl font-bold text-gray-900">
                {tables.filter(t => t.status === 'occupied').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reserved</p>
              <p className="text-2xl font-bold text-gray-900">
                {tables.filter(t => t.status === 'reserved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`relative bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-shadow cursor-pointer ${getStatusColor(table.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(table.status)}
                <span className="font-medium capitalize">{table.status}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-gray-700">
                  {table.table_number}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Table {table.table_number}
              </h3>
              
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{table.capacity} seats</span>
                </div>
                
                {table.current_order_id && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700">
                      Order #{table.current_order_id}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      ${parseFloat(table.current_order_total || '0').toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {table.status === 'available' && (
              <div className="absolute inset-0 bg-green-50 bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Ready for Orders
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tables found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first table.
          </p>
        </div>
      )}
    </div>
  );
};

export default TableManagement;