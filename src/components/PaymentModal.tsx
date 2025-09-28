import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Banknote } from 'lucide-react';
import api from '../services/api';

interface Order {
  id: number;
  table_number: number;
  total_amount: string;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onPaymentProcessed: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  open, 
  onClose, 
  order, 
  onPaymentProcessed 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [loading, setLoading] = useState(false);

  const orderTotal = order ? parseFloat(order.total_amount) : 0;
  const receivedAmount = parseFloat(amountReceived) || 0;
  const change = receivedAmount - orderTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;
    
    if (receivedAmount < orderTotal) {
      return;
    }

    setLoading(true);
    try {
      await api.post(`/orders/${order.id}/payment`, {
        payment_method: paymentMethod,
        amount_received: receivedAmount
      });
      
      onPaymentProcessed();
      handleClose();
    } catch (error) {
      console.error('Failed to process payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentMethod('cash');
    setAmountReceived('');
    onClose();
  };

  const handleQuickAmount = (amount: number) => {
    setAmountReceived(amount.toString());
  };

  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Process Payment</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Table {order.table_number} • Order #{order.id}
              </h4>
              <p className="text-3xl font-bold text-gray-900">
                ${orderTotal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Banknote className="h-5 w-5" />
                <span>Cash</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span>Card</span>
              </button>
            </div>
          </div>

          {/* Amount Received */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Received
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                min={orderTotal}
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            
            {paymentMethod === 'cash' && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[orderTotal, orderTotal + 5, orderTotal + 10, orderTotal + 20].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    ${amount.toFixed(2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Change */}
          {paymentMethod === 'cash' && receivedAmount > 0 && (
            <div className="mb-6">
              <div className={`p-4 rounded-lg ${
                change >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Change:</span>
                  <span className={`text-lg font-bold ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(change).toFixed(2)}
                    {change < 0 && ' (Insufficient)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || receivedAmount < orderTotal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Process Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;