import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader.jsx';

function Home({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, setCategories }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://e-commerce-production-fa5d.up.railway.app/api/products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract categories for navbar
      const cats = ['All', ...new Set(data.map(p => p.category))];
      setCategories(cats);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let result = [...products];

    // Search by name or description
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(result);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#232f3e] to-[#131921] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Welcome to E-Shop</h1>
          <p className="text-lg md:text-xl text-gray-200">Discover amazing products at unbeatable prices</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="bg-white rounded-lg shadow-sm p-3 mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Filters:</span>
            {searchQuery && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-600">×</button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="hover:text-green-600">×</button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <p className="text-gray-600 text-sm mb-4">
          Showing <span className="font-bold text-[#131921]">{filteredProducts.length}</span> of {products.length} products
        </p>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-500 mb-2">No products found</p>
            <p className="text-sm text-gray-400 mb-4">Try different search terms or category</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-[#007185] hover:text-[#c7511f] hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-200 overflow-hidden border border-gray-200">
                <div className="relative bg-gray-50 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain hover:scale-105 transition duration-200"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <h3 className="text-base font-medium text-[#0f1111] line-clamp-2 mb-1 hover:text-[#c7511f] cursor-pointer">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-[#ffa41c] text-sm">
                      {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                    <span className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">124</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xs align-top">$</span>
                    <span className="text-2xl font-bold text-[#0f1111]">{Math.floor(product.price)}</span>
                    <span className="text-xs align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Get it by <span className="font-bold">Tomorrow</span></p>
                  <Link
                    to={`/product/${product._id}`}
                    className="block w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] text-sm font-medium py-2 rounded-full text-center transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;