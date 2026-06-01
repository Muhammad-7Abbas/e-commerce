import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, UserPlus } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      navigate('/login'); 
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131921] px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingBag size={40} className="text-[#febd69]" />
            <span className="text-3xl font-bold text-white">E-Shop</span>
          </div>
          <p className="text-gray-400">Create your E-Shop account</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus size={24} className="text-[#131921]" />
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-[#febd69] focus:border-[#febd69] outline-none"
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] font-bold py-2 rounded-md transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#007185] hover:text-[#c7511f] hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2026 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;