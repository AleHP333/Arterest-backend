const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    userName: {type: String, required: true},
    password: {type: String, required: true},
    names: {type: String, required: false},
    surnames: {type: String, required: false},
    country: {type: String, required: false},
    city: {type: String, required: false},
    verification: {type: Boolean, required: false},
    uniqueString: {type: String, required: false}
})

const User = mongoose.model("users", userSchema);

module.exports = User;