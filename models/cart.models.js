const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: { type: Number, default: 1 },
      size: { type: String },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
