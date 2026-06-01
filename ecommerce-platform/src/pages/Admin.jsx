import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';

function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
    fetchOrders();
    fetchProducts();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image
    });
  };

  const closeEditModal = () => setEditingProduct(null);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editForm,
          price: Number(editForm.price),
          stock: Number(editForm.stock)
        })
      });
      if (res.ok) { fetchProducts(); closeEditModal(); }
    } catch (error) { console.log(error); }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setAddForm({ name: '', description: '', price: '', stock: '', category: '', image: '' });
  };

  const closeAddModal = () => setShowAddModal(false);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const saveAdd = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...addForm,
          price: Number(addForm.price),
          stock: Number(addForm.stock)
        })
      });
      if (res.ok) { fetchProducts(); closeAddModal(); }
    } catch (error) { console.log(error); }
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex gap-2 md:gap-4 mb-8 border-b overflow-x-auto">
        {['dashboard', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 md:px-4 py-2 capitalize whitespace-nowrap text-sm md:text-base ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <p className="text-gray-500 text-xs md:text-sm">Total Products</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <p className="text-gray-500 text-xs md:text-sm">Total Orders</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <p className="text-gray-500 text-xs md:text-sm">Total Users</p>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <p className="text-gray-500 text-xs md:text-sm">Pending Orders</p>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold">All Products</h2>
            <button 
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full sm:w-auto"
            >
              + Add Product
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-sm">Image</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm">Name</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm">Price</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm">Stock</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="px-4 py-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 text-sm">{product.name}</td>
                    <td className="px-4 py-3 text-sm">${product.price}</td>
                    <td className="px-4 py-3 text-sm">{product.stock}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:underline mr-2 md:mr-3 text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-bold">All Orders</h2>
          
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Order ID: {order._id}</p>
                  <p className="text-xs text-gray-500 truncate">Customer: {order.user?.name} ({order.user?.email})</p>
                  <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <p className="font-medium mb-2 text-sm">Items:</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-2">
                    <img src={item.image} alt={item.name} className="w-8 h-8 md:w-10 md:h-10 object-cover rounded" />
                    <span className="text-xs md:text-sm truncate">{item.name} x {item.quantity}</span>
                  </div>
                ))}
                <p className="text-right font-bold text-blue-600 mt-2 text-sm">Total: ${order.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" name="stock" value={editForm.stock} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" name="category" value={editForm.category} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" name="image" value={editForm.image} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={saveEdit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
              <button onClick={closeEditModal} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={addForm.name} onChange={handleAddChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={addForm.description} onChange={handleAddChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" name="price" value={addForm.price} onChange={handleAddChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" name="stock" value={addForm.stock} onChange={handleAddChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" name="category" value={addForm.category} onChange={handleAddChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Electronics, Sports, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" name="image" value={addForm.image} onChange={handleAddChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={saveAdd} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add Product</button>
              <button onClick={closeAddModal} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;