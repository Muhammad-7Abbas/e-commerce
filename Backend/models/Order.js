import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingInfo: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;