const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    size: { type: String, default: '' },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Placed' }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;