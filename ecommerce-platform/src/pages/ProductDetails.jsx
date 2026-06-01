import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Loader from '../components/Loader.jsx';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    alert(`Added ${quantity} ${product.name}(s) to cart`);
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full max-w-md h-64 md:h-96 object-cover rounded-lg"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-sm md:text-base">{product.description}</p>
          <p className="text-xl md:text-2xl font-bold text-blue-600">${product.price}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock} available</p>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center border rounded">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 active:bg-gray-200"
              >-</button>
              <span className="px-3 py-2 min-w-[40px] text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 active:bg-gray-200"
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition w-full sm:w-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;