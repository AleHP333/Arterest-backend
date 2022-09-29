const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const productTestSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: "users" },
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    origin: {type: String, required: true},
    technique: [{type: String, required: true}],
    style: {type: String, required: false},
    colors: [{type: String, required: false}],
    releaseDate: {type: Number, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: false, default: 10},
    tags: [{type: String, required: true}],
    transactions: {
        type: [Schema.Types.ObjectId],
        ref: 'Transaction',
      },
    likes: {type: Array},
    comments: [{
        date: {type: Date},
        comment: {type: String},
        userId: {type: mongoose.Types.ObjectId, ref: "users" }
    }]
})

const ProductTest = mongoose.model("productsTest", productTestSchema);

module.exports = ProductTest