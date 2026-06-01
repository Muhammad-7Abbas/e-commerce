import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 text-center">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-md mx-auto">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
        
        {orderId && (
          <p className="text-xs md:text-sm text-gray-500 mb-6 font-mono">Order ID: {orderId}</p>
        )}
        
        <Link 
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;