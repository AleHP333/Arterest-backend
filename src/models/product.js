const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const productSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    userImage: {type: String, required: false},
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    origin: {type: String, required: true},
    technique: [{type: String, required: true}],
    style: {type: String, required: false},
    colors: [{type: String, required: false}],
    releaseDate: {type: Date, required: true},
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

const Product = mongoose.model("products", productSchema);

module.exports = Product