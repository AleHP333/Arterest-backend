const mongoose = require('mongoose');

const passwordSchema = mongoose.Schema({
    email: {type: String, required: true},
    uniqueString: {type: String, required: true},
    code: {type: String, required: true}
})

const Password = mongoose.model("passwords", passwordSchema);

module.exports = Password