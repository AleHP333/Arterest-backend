const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const productArtistSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: "users" },
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
})

const ProductArtist = mongoose.model("productsArtist", productArtistSchema);

module.exports = ProductArtist