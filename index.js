const express = require('express');
const cors = require("cors");
const connectDB = require('./db/connection.db');
const Product = require('./models/product.models');
const Cart = require('./models/cart.models');
const Wishlist = require('./models/wishlist.models');
const Order = require('./models/order.models');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// connect to DB
connectDB();

// check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// get all products - multiple endpoints for compatibility
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
});

// get all products (all category) /products/all
app.get('/products/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
});

// get products by category
app.get('/products/:category', async (req, res) => {
  try {
    const { category } = req.params;
    let products;

    if (category === 'all') {
      products = await Product.find({});
    } else {
      products = await Product.find({ category });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get product by id
app.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve product' });
  }
});

// cart (get by userEmail)
app.get('/cart/:userEmail', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userEmail: req.params.userEmail }).lean();
    res.json({ cart: cart || { items: [] } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// app.post('/cart/:userEmail', async (req, res) => {
//   try {
//     const { productId, qty = 1, size } = req.body;
//     let cart = await Cart.findOne({ userEmail: req.params.userEmail });
//     if (!cart) {
//       cart = new Cart({ userEmail: req.params.userEmail, items: [] });
//     }
//     const existing = cart.items.find((it) => String(it.productId) === String(productId));
//     if (existing) existing.qty += qty;
//     else cart.items.push({ productId, qty, size });
//     await cart.save();
//     res.json({ cart });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Failed to update cart' });
//   }
// });

app.delete('/cart/:userEmail/:productId', async (req, res) => {
  try {
    const { userEmail, productId } = req.params;
    const cart = await Cart.findOne({ userEmail });
    if (!cart) return res.json({ cart: { items: [] } });
    cart.items = cart.items.filter((it) => String(it.productId) !== productId);
    await cart.save();
    res.json({ cart });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

// wishlist
app.get('/wishlist/:userEmail', async (req, res) => {
  try {
    const wl = await Wishlist.findOne({ userEmail: req.params.userEmail }).lean();
    res.json({ wishlist: wl || { items: [] } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

app.post('/wishlist/:userEmail', async (req, res) => {
  try {
    const { productId } = req.body;
    let wl = await Wishlist.findOne({ userEmail: req.params.userEmail });
    if (!wl) wl = new Wishlist({ userEmail: req.params.userEmail, items: [] });
    const exists = wl.items.find((it) => String(it.productId) === String(productId));
    if (!exists) wl.items.push({ productId });
    await wl.save();
    res.json({ wishlist: wl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
});

app.delete('/wishlist/:userEmail/:productId', async (req, res) => {
  try {
    const { userEmail, productId } = req.params;
    const wl = await Wishlist.findOne({ userEmail });
    if (!wl) return res.json({ wishlist: { items: [] } });
    wl.items = wl.items.filter((it) => String(it.productId) !== productId);
    await wl.save();
    res.json({ wishlist: wl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to remove item from wishlist' });
  }
});

// orders
app.get('/orders/:userEmail', async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.userEmail }).lean();
    res.json({ orders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));