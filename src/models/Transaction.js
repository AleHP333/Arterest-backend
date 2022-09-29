const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  transaction: {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'products'
    },
    
    quantity:{
      type: Number
    },

  status: {
    type: String,
    enum: ['pending', 'rejected', 'fulfilled'],
    default: 'pending',
  },
  total_money: {
    type: Number,
  }
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  dateOfBuy: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});


const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
