const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      imageUrl: {
        type: String,
        default: ''
      }
    }],
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending'
    },
    orderDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'orderedFood' 
  }
);

// Indexes for query optimization
OrderSchema.index({ username: 1, orderDate: -1 });
OrderSchema.index({ status: 1, orderDate: -1 });
OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema, 'orderedFood');

