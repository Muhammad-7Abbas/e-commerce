import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import { Package } from 'lucide-react';

function Orders() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Handle 401 - token expired or invalid
      if (res.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.log('Unexpected response:', data);
        setOrders([]);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <Loader />;

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <Link to="/" className="text-blue-600 hover:underline">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-xs md:text-sm">{order._id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-xs md:text-sm text-gray-500 mb-2">Items</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">Ordered on</p>
                <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg md:text-xl font-bold text-blue-600">${order.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;