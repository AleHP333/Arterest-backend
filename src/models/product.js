const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    origin: {type: String, required: true},
    technique: [{type: String, required: true}],
    style: {type: String, required: false},
    colors: [{type: String, required: false}],
    releaseDate: {type: Date, required: true},
    price: {type: Number, required: true},
    tags: [{type: String, required: true}]
})

const Product = mongoose.model("products", productSchema);

module.exports = Product;