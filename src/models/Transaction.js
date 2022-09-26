const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  transaction: {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    
    quantity:{
      type: Number
    },

  status: {
    type: String,
    enum: ['pending', 'rejected', 'fulfilled'],
    default: 'pending',
  },
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  dateOfBuy: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});


const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
