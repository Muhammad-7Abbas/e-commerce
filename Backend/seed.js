import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    stock: 10
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily workouts',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Sports',
    stock: 15
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    stock: 8
  },
  {
    name: 'Backpack',
    description: 'Durable backpack for travel and daily use',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'Accessories',
    stock: 20
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic coffee maker for perfect brew',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    category: 'Home',
    stock: 5
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for comfortable practice',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    category: 'Sports',
    stock: 25
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

seed();