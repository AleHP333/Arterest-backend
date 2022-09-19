const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    userName: {type: String, required: true},
    password: {type: String, required: true},
    names: {type: String, required: true},
    surnames: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    verification: {type: Boolean, required: true},
    uniqueString: {type: String, required: true}
})

const User = mongoose.model("users", userSchema);

module.exports = User;