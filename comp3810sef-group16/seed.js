const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin0905:pw0905@cluster0.ohykvbr.mongodb.net/food-ordering?retryWrites=true&w=majority';

const sampleMenuItems = [
  {
    name: "Margherita Pizza",
    category: "Pizza",
    price: 12.99,
    description: "Classic Italian pizza with fresh tomatoes, mozzarella cheese, and basil",
    imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
    available: true
  },
  {
    name: "Spaghetti Bolognese",
    category: "Pasta",
    price: 10.50,
    description: "Traditional Italian meat sauce served with handmade pasta",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
    available: true
  },
  {
    name: "Caesar Salad",
    category: "Salad",
    price: 8.99,
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese",
    available: true
  },
  {
    name: "Cola",
    category: "Drinks",
    price: 2.50,
    description: "Ice cold Coca-Cola",
    available: true
  },
  {
    name: "Cheesecake",
    category: "Desserts",
    price: 6.99,
    description: "New York style cheesecake with creamy texture",
    imageUrl: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400",
    available: true
  },
  {
    name: "Chicken Burger",
    category: "Burgers",
    price: 9.99,
    description: "Grilled chicken breast with lettuce, tomato, and special sauce",
    available: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing data
    await MenuItem.deleteMany({});
    console.log('✅ Cleared existing menu items');

    // Insert sample data
    await MenuItem.insertMany(sampleMenuItems);
    console.log('✅ Successfully added sample menu items');

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();

