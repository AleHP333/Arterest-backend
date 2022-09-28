const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: "users" },
    message: {type: String, required: true},
    url1: {type: String, required: true},
    url2: {type: String, required: true},
    url3: {type: String, required: true},
})

const Request = mongoose.model("request", requestSchema);

module.exports = Request