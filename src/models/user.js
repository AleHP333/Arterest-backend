const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    userName: {type: String, required: true},
    userImage: {type: String, required: false},
    password: {type: String, required: true},
    names: {type: String, required: false},
    surnames: {type: String, required: false},
    country: {type: String, required: false},
    city: {type: String, required: false},
    verification: {type: Boolean, required: false},
    uniqueString: {type: String, required: false},
    role: {type: String, required: true},
    isBanned: {type: Boolean, required: false, default: false},
    cart: {type: mongoose.Types.ObjectId, ref: "products" },
    buyHistory: {type: mongoose.Types.ObjectId, ref: "products" },
})

const User = mongoose.model("users", userSchema);

module.exports = User;