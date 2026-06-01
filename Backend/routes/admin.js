import express from 'express';
import adminMiddleware from '../middleware/admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin view)
router.get('/orders', adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: 'Status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/products', adminMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:id', adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;