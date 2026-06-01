import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingCart, Search, Menu, X, MapPin, ChevronDown } from 'lucide-react';

function Navbar({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) {
  const { user, isLoggedIn, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
    // Search is handled by Home component via props
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-[#131921] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white p-1 rounded shrink-0">
              <span className="text-xl md:text-2xl font-bold text-white">E-Shop</span>
            </Link>

            {/* Location (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 text-xs hover:outline hover:outline-1 hover:outline-white p-2 rounded cursor-pointer shrink-0">
              <MapPin size={16} />
              <div className="leading-tight">
                <p className="text-gray-300 text-[10px]">Deliver to</p>
                <p className="font-bold text-sm">Pakistan</p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 flex max-w-3xl mx-2">
              <div className="hidden sm:block relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (location.pathname !== '/') navigate('/');
                  }}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-2.5 rounded-l-md border-r border-gray-300 focus:outline-none h-full cursor-pointer hover:bg-gray-200"
                >
                  {categories?.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Search E-Shop"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (location.pathname !== '/') navigate('/');
                }}
                className="flex-1 px-3 py-2 text-gray-800 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-[#febd69] hover:bg-[#f3a847] px-3 md:px-4 py-2 rounded-r-md transition"
              >
                <Search size={20} className="text-gray-800" />
              </button>
            </form>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-1 shrink-0">
              
              {/* Account */}
              {isLoggedIn ? (
                <div className="hover:outline hover:outline-1 hover:outline-white p-2 rounded cursor-pointer relative group">
                  <p className="text-[10px] text-gray-300 leading-tight">Hello, {user?.name}</p>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm">Account</p>
                    <ChevronDown size={14} />
                  </div>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-2 hidden group-hover:block min-w-[150px] z-50">
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 text-sm">My Orders</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-sm">Admin Panel</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hover:outline hover:outline-1 hover:outline-white p-2 rounded">
                  <p className="text-[10px] text-gray-300 leading-tight">Hello, sign in</p>
                  <p className="font-bold text-sm">Account</p>
                </Link>
              )}

              {/* Orders */}
              <Link to="/orders" className="hover:outline hover:outline-1 hover:outline-white p-2 rounded">
                <p className="text-[10px] text-gray-300 leading-tight">Returns</p>
                <p className="font-bold text-sm">& Orders</p>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-end gap-1 hover:outline hover:outline-1 hover:outline-white p-2 rounded">
                <div className="relative">
                  <ShoppingCart size={28} />
                  <span className="absolute -top-0.5 -right-1 bg-[#f08804] text-[#131921] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                </div>
                <span className="font-bold text-sm hidden xl:inline">Cart</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:outline hover:outline-1 hover:outline-white rounded shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Bar (Categories) */}
      <div className="bg-[#232f3e] px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-1 text-sm overflow-x-auto">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded font-bold text-white shrink-0"
          >
            <Menu size={18} />
            <span>All</span>
          </button>
          <Link to="/" className="text-white hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded whitespace-nowrap">Home</Link>
          <Link to="/" className="text-white hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded whitespace-nowrap">Today's Deals</Link>
          <Link to="/" className="text-white hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded whitespace-nowrap">Customer Service</Link>
          <Link to="/" className="text-white hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded whitespace-nowrap">Registry</Link>
          <Link to="/" className="text-white hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded whitespace-nowrap">Gift Cards</Link>
          <Link to="/" className="text-white hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded whitespace-nowrap">Sell</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#232f3e] px-4 py-4 space-y-3 fixed inset-x-0 top-[60px] z-40 shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-gray-800 rounded-l-md text-sm"
            />
            <button type="submit" className="bg-[#febd69] px-4 py-2 rounded-r-md">
              <Search size={20} className="text-gray-800" />
            </button>
          </form>

          <Link to="/" className="block py-2 hover:bg-[#37475a] px-2 rounded text-sm text-white" onClick={closeMenu}>Home</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/orders" className="block py-2 hover:bg-[#37475a] px-2 rounded text-sm text-white" onClick={closeMenu}>My Orders</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="block py-2 hover:bg-[#37475a] px-2 rounded text-sm text-white" onClick={closeMenu}>Admin Panel</Link>
              )}
              <Link to="/cart" className="block py-2 hover:bg-[#37475a] px-2 rounded text-sm text-white" onClick={closeMenu}>
                Cart ({getCartCount()})
              </Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 hover:bg-[#37475a] px-2 rounded text-sm text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:bg-[#37475a] px-2 rounded text-sm text-white" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="block py-2 hover:bg-[#37475a] px-2 rounded text-sm text-white" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;