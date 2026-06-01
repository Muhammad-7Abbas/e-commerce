import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ShoppingBag, Lock, Truck, Shield } from 'lucide-react';

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingInfo: formData,
          totalAmount: getCartTotal() + 5
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Order failed');
        setLoading(false);
        return;
      }

      clearCart();
      navigate('/order-success', { state: { orderId: data.order._id } });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty, show message (but this shouldn't happen on first visit)
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-white rounded-lg shadow-sm mt-8">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart before checkout.</p>
        <button 
          onClick={() => navigate('/')}
          className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold px-6 py-2 rounded-md transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8 flex items-center gap-2">
        <Lock size={16} />
        Secure checkout
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Truck size={20} className="text-[#007185]" />
              Delivery Address
            </h2>
            
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4 text-sm border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                  placeholder="House no, street, area"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                    placeholder="City name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pincode / ZIP</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                    placeholder="54000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                <Shield size={16} />
                <span>Your information is secure and encrypted</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] font-bold py-3 rounded-full transition disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold mb-4 text-[#0f1111]">Order Summary</h2>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0f1111] truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">$5.00</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0f1111] pt-2 border-t">
                <span>Total</span>
                <span>${(getCartTotal() + 5).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;