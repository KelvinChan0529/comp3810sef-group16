const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Menu item name is required'], 
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'], 
      trim: true, 
      index: true,
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'], 
      min: [0, 'Price cannot be negative'],
      max: [10000, 'Price cannot exceed 10000']
    },
    description: { 
      type: String, 
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: { 
      type: String, 
      default: '',
      validate: {
        validator: function(v) {
          // Simple URL validation, allow empty string
          return v === '' || /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Please provide a valid image URL'
      }
    },
    available: { 
      type: Boolean, 
      default: true 
    },
  },
  { 
    timestamps: true 
  }
);


MenuItemSchema.index({ name: 'text', description: 'text' });


MenuItemSchema.index({ category: 1, available: 1, price: 1 });
MenuItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MenuItem', MenuItemSchema);

