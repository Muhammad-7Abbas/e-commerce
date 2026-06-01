import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-white rounded-lg shadow-sm mt-8">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Please login to view your cart</h2>
        <Link to="/login" className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold px-6 py-2 rounded-md transition">
          Login here
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-white rounded-lg shadow-sm mt-8">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold px-6 py-2 rounded-md transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm p-3 md:p-4 flex flex-col sm:flex-row gap-3 md:gap-4 border border-gray-200">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-[#0f1111] text-sm md:text-base line-clamp-2">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                <p className="text-lg font-bold text-[#0f1111]">${item.price}</p>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 active:bg-gray-200 text-sm"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 min-w-[40px] text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 active:bg-gray-200 text-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="text-right sm:text-left">
                <p className="font-bold text-lg text-[#0f1111]">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
          >
            Clear all items
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 h-fit border border-gray-200">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-[#0f1111]">Order Summary</h2>
          
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">$5.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base md:text-lg text-[#0f1111]">
              <span>Total</span>
              <span>${(getCartTotal() + 5).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] font-bold py-3 rounded-full transition mb-3 flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>
          
          <div className="text-center">
            <Link to="/" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;