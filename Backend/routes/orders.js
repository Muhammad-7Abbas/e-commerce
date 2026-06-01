import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';

const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shippingInfo, totalAmount } = req.body;

    const order = await Order.create({
      user: req.userId,
      items,
      shippingInfo,
      totalAmount
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;