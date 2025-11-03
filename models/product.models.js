const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPercentage: { type: Number },
  description: { type: String },
  availableSizes: { type: [String], enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  color: { type: String },
  material: { type: String },
  features: { type: [String] },
  returnPolicy: { type: String, default: '10 days returnable' },
  paymentOptions: { type: [String], enum: ['Pay on Delivery', 'Secure Payment'], default: ['Pay on Delivery'] },
  deliveryOptions: { type: [String], enum: ['Free Delivery'], default: ['Free Delivery'] },
  category: { type: String, required: true, enum: ['men', 'women', 'kids', 'electronics', 'all'] },
  image: { type: String },
  dateAdded: { type: Date, default: Date.now },
  stockQuantity: { type: Number, default: 0 },
  rating: { type: Number, default: 4.0 }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;