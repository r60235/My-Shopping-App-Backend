const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } }],
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
