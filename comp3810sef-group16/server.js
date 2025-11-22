const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const app = express();

// Configuration
const SECRETKEY = 'COMP 3810SEF Group 16 pass';
const mongoUrl = 'mongodb+srv://admin0905:pw0905@cluster0.ohykvbr.mongodb.net/?appName=Cluster0';  
const client = new MongoClient(mongoUrl);
const dbName = 'login'; 
const collectionName = 'userData';
const PORT = process.env.PORT || 8099;

// MongoDB connection for menu (using Mongoose)
const MONGODB_MENU_URI = process.env.MONGODB_MENU_URI || 'mongodb+srv://admin0905:pw0905@cluster0.ohykvbr.mongodb.net/food-ordering?retryWrites=true&w=majority';

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection for login (using native driver)
async function connectMongo() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB (Login DB)!");
    return client.db(dbName);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

// Middleware to attach database to request
app.use(async (req, res, next) => {
  req.db = await connectMongo();
  next();
});

// Connect to MongoDB for menu (using Mongoose)
mongoose.connect(MONGODB_MENU_URI)
  .then(() => console.log('✅ MongoDB connected successfully (Menu DB)'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

// ==================== LOGIN ROUTES ====================

// Home page - redirect to login if not authenticated
app.get('/', (req, res) => {
  if (!req.session.authenticated) { 
    res.redirect('/login');
  } else {
    res.status(200).render('homepage', { name: req.session.username });
  }
});

// Login page
app.get('/login', (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/');
  } else {
    res.status(200).render('login', {});
  }
});

// Login POST
app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const db = req.db;
  const user = await db.collection(collectionName).findOne({ name, password });

  if (user) { 
    req.session.authenticated = true;
    req.session.username = name;
    res.redirect('/');
  } else { 
    res.status(401).send('Invalid username or password');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session = null; 
  res.redirect('/');
});

// Register page
app.get('/register', (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/');
  } else {
    res.status(200).render('register', {});
  }
});

// Register POST
app.post('/register', async (req, res) => {
  const { name, password } = req.body;
  const db = req.db;

  // Check if user already exists
  const existingUser = await db.collection(collectionName).findOne({ name });
  if (existingUser) {
    res.status(400).send('User already exists');
    return;
  }

  // Create new user
  await db.collection(collectionName).insertOne({ name, password });
  res.redirect('/login');
});

// ==================== MENU ROUTES ====================

const menuRouter = express.Router();

// READ (list) with search/filters
menuRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { 
      q = '', 
      category = '', 
      min = '', 
      max = '', 
      available = '', 
      page = 1, 
      limit = 12 
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Text search
    if (q) {
      filter.$text = { $search: q };
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Price range filter
    const priceFilter = {};
    if (min !== '' && !isNaN(min)) priceFilter.$gte = Number(min);
    if (max !== '' && !isNaN(max)) priceFilter.$lte = Number(max);
    if (Object.keys(priceFilter).length) filter.price = priceFilter;
    
    // Availability filter
    if (available === 'true') filter.available = true;
    if (available === 'false') filter.available = false;

    // Pagination
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = parseInt(limit) || 12;
    const skip = (currentPage - 1) * itemsPerPage;

    // Parallel queries
    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(itemsPerPage),
      MenuItem.countDocuments(filter)
    ]);

    // Get categories for filter dropdown
    const categories = await MenuItem.distinct('category');

    res.render('menu/index', {
      items,
      total,
      page: currentPage,
      limit: itemsPerPage,
      q,
      category,
      min,
      max,
      available,
      categories
    });
  } catch (error) {
    console.error('❌ Failed to load menu:', error);
    res.status(500).send('Failed to load menu. Please try again later.');
  }
});

// CREATE form
menuRouter.get('/new', requireAuth, (req, res) => {
  res.render('menu/new', { item: {} });
});

// CREATE submit
menuRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, available } = req.body;
    
    await MenuItem.create({
      name,
      category,
      price: Number(price),
      description: description || '',
      imageUrl: imageUrl || '',
      available: available === 'on' || available === true
    });
    
    res.redirect('/menu');
  } catch (error) {
    console.error('❌ Failed to create menu item:', error);
    res.status(400).send('Failed to create menu item. Please check required fields.');
  }
});

// READ detail
menuRouter.get('/:id', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).send('Menu item not found');
    res.render('menu/show', { item });
  } catch (error) {
    console.error('❌ Failed to find menu item:', error);
    res.status(400).send('Invalid menu item ID');
  }
});

// UPDATE form
menuRouter.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).send('Menu item not found');
    res.render('menu/edit', { item });
  } catch (error) {
    console.error('❌ Failed to load edit form:', error);
    res.status(400).send('Invalid menu item ID');
  }
});

// UPDATE submit
menuRouter.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, available } = req.body;
    
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price: Number(price),
        description,
        imageUrl,
        available: available === 'on' || available === true
      },
      { new: true, runValidators: true }
    );
    
    if (!item) return res.status(404).send('Menu item not found');
    
    res.redirect(`/menu/${item._id}`);
  } catch (error) {
    console.error('❌ Failed to update menu item:', error);
    res.status(400).send('Failed to update menu item');
  }
});

// DELETE
menuRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).send('Menu item not found');
    res.redirect('/menu');
  } catch (error) {
    console.error('❌ Failed to delete menu item:', error);
    res.status(400).send('Failed to delete menu item');
  }
});

// Mount menu routes
app.use('/menu', menuRouter);

// ==================== ORDER ROUTES ====================

// Order page - Browse and order food
app.get('/order', requireAuth, async (req, res) => {
  try {
    // Get only available items
    const items = await MenuItem.find({ available: true })
      .sort({ category: 1, name: 1 });
    
    // Get categories
    const categories = await MenuItem.distinct('category');
    
    // Get cart from session
    const cart = req.session.cart || [];
    
    res.render('order', { 
      items, 
      categories,
      cart,
      username: req.session.username 
    });
  } catch (error) {
    console.error('❌ Failed to load order page:', error);
    res.status(500).send('Failed to load order page');
  }
});

// Add to cart
app.post('/order/add-to-cart', requireAuth, async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    const item = await MenuItem.findById(itemId);
    if (!item || !item.available) {
      return res.status(400).json({ error: 'Item not available' });
    }
    
    // Check if item already in cart
    const cartItemIndex = req.session.cart.findIndex(
      cartItem => cartItem.itemId.toString() === itemId
    );
    
    if (cartItemIndex > -1) {
      // Update quantity
      req.session.cart[cartItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item
      req.session.cart.push({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: parseInt(quantity),
        imageUrl: item.imageUrl
      });
    }
    
    res.json({ 
      success: true, 
      cart: req.session.cart,
      message: `${item.name} added to cart!`
    });
  } catch (error) {
    console.error('❌ Failed to add to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Update cart item quantity
app.post('/order/update-cart', requireAuth, (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    
    if (!req.session.cart) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    const cartItemIndex = req.session.cart.findIndex(
      cartItem => cartItem.itemId.toString() === itemId
    );
    
    if (cartItemIndex > -1) {
      if (parseInt(quantity) <= 0) {
        // Remove item
        req.session.cart.splice(cartItemIndex, 1);
      } else {
        // Update quantity
        req.session.cart[cartItemIndex].quantity = parseInt(quantity);
      }
    }
    
    res.json({ success: true, cart: req.session.cart });
  } catch (error) {
    console.error('❌ Failed to update cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove from cart
app.post('/order/remove-from-cart', requireAuth, (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!req.session.cart) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    req.session.cart = req.session.cart.filter(
      cartItem => cartItem.itemId.toString() !== itemId
    );
    
    res.json({ success: true, cart: req.session.cart });
  } catch (error) {
    console.error('❌ Failed to remove from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// Clear cart
app.post('/order/clear-cart', requireAuth, (req, res) => {
  req.session.cart = [];
  res.json({ success: true, message: 'Cart cleared' });
});

// Submit order
app.post('/order/submit', requireAuth, async (req, res) => {
  try {
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Save order to database
    const orderData = {
      username: req.session.username,
      items: cart.map(item => ({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || ''
      })),
      total: total,
      status: 'pending',
      orderDate: new Date()
    };
    
    // Save to orderedFood collection
    const savedOrder = await Order.create(orderData);
    console.log('✅ Order saved to database:', savedOrder._id);
    
    // Clear cart
    req.session.cart = [];
    
    res.json({ 
      success: true, 
      message: 'Order placed successfully!',
      order: savedOrder
    });
  } catch (error) {
    console.error('❌ Failed to submit order:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

// ==================== API ROUTES (Optional - for API access) ====================

// CREATE - Add a new menu item (API)
app.post('/api/menu', requireAuth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, available } = req.body;
    const item = await MenuItem.create({
      name,
      category,
      price: Number(price),
      description: description || '',
      imageUrl: imageUrl || '',
      available: available === true || available === 'true'
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - Get all menu items (API)
app.get('/api/menu', requireAuth, async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Get a single menu item (API)
app.get('/api/menu/:id', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read menu item by name
app.get('/api/menu/name/:name', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findOne({ name: req.params.name }); // 用 name 找
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update a menu item (API)
app.put('/api/menu/:id', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update menu item by name
app.put('/api/menu/name/:name', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findOneAndUpdate(
      { name: req.params.name },  
      req.body,                    
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete a single menu item (API)
app.delete('/api/menu/:id', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete menu item by name
app.delete('/api/menu/name/:name', requireAuth, async (req, res) => {
  try {
    const item = await MenuItem.findOneAndDelete({ name: req.params.name }); 
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete all menu items (API)
app.delete('/api/menu', requireAuth, async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Login DB: ${mongoUrl}`);
  console.log(`📊 Menu DB: ${MONGODB_MENU_URI}`);
});

