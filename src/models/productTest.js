const mongoose = require("mongoose")

const productTestSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    userImage: {type: String, required: false},
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    origin: {type: String, required: false},
    technique: [{type: String, required: true}],
    style: {type: String, required: false},
    colors: [{type: String, required: false}],
    releaseDate: {type: String, required: true},
    price: {type: Number, required: true},
    tags: [{type: String, required: true}]
})

const ProductTest = mongoose.model("productTests", productTestSchema);

module.exports = ProductTest;