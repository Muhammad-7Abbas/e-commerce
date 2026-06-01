import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={24} className="text-blue-400" />
              <span className="text-xl font-bold">E-Shop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition cursor-pointer">Electronics</li>
              <li className="hover:text-white transition cursor-pointer">Sports</li>
              <li className="hover:text-white transition cursor-pointer">Accessories</li>
              <li className="hover:text-white transition cursor-pointer">Home</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-sm">support@eshop.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span className="text-sm">+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-sm">123 Shop Street, NY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;