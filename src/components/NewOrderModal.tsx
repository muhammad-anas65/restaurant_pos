import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  category: string;
  available: boolean;
}

interface Table {
  id: number;
  table_number: number;
  status: string;
}

interface OrderItem {
  menu_item_id: number;
  quantity: number;
  notes: string;
}

interface NewOrderModalProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ open, onClose, onOrderCreated }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchMenuItems();
      fetchTables();
      fetchCategories();
    }
  }, [open]);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu?available=true');
      setMenuItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables?status=available');
      setTables(response.data.tables || []);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menu_item_id === menuItem.id);
    
    if (existingItem) {
      setOrderItems(prev => 
        prev.map(item => 
          item.menu_item_id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems(prev => [...prev, {
        menu_item_id: menuItem.id,
        quantity: 1,
        notes: ''
      }]);
    }
  };

  const updateQuantity = (menuItemId: number, change: number) => {
    setOrderItems(prev => 
      prev.map(item => {
        if (item.menu_item_id === menuItemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeFromOrder = (menuItemId: number) => {
    setOrderItems(prev => prev.filter(item => item.menu_item_id !== menuItemId));
  };

  const getOrderTotal = () => {
    return orderItems.reduce((total, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
      return total + (menuItem ? parseFloat(menuItem.price) * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTable) {
      toast.error('Please select a table');
      return;
    }
    
    if (orderItems.length === 0) {
      toast.error('Please add items to the order');
      return;
    }

    setLoading(true);
    try {
      await api.post('/orders', {
        table_id: selectedTable,
        items: orderItems,
        notes
      });
      
      onOrderCreated();
      handleClose();
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTable(null);
    setOrderItems([]);
    setNotes('');
    setSelectedCategory('all');
    onClose();
  };

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Create New Order</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Table
                </label>
                <select
                  value={selectedTable || ''}
                  onChange={(e) => setSelectedTable(Number(e.target.value))}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a table...</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.table_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => addToOrder(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order Summary
                </h4>
                
                <div className="space-y-3 mb-4">
                  {orderItems.length > 0 ? (
                    orderItems.map((item) => {
                      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
                      if (!menuItem) return null;
                      
                      return (
                        <div key={item.menu_item_id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{menuItem.name}</p>
                            <p className="text-xs text-gray-500">
                              ${parseFloat(menuItem.price).toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.menu_item_id, -1)}
                              className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.menu_item_id, 1)}
                              className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No items added yet
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${getOrderTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Special requests..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTable || orderItems.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                `Create Order (${orderItems.length} items)`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;