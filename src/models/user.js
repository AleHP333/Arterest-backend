const mongoose = require("mongoose");
const { Schema, model } = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    userName: {type: String, required: true},
    userImage: {type: String, required: false},
    from: {type: Array},
    password: [{ type: String, required: true }],
    names: {type: String, required: false},
    surnames: {type: String, required: false},
    country: {type: String, required: false},
    city: {type: String, required: false},
    verification: {type: Boolean, required: false},
    uniqueString: {type: String, required: false},
    isAdmin: {type: Boolean, required: false, default: false},
    isBanned: {type: Boolean, required: false, default: false},
    purchase_order: {
        products: [{
          publicationId: {
            type: Schema.Types.ObjectId,
            ref: 'product'
          },
          quantity: {
            type: Number
          },
        }],
        link: {
          type: String
        }
      },
    buyHistory: {type: [Schema.Types.ObjectId],
        ref: "Transaction",
      },
    user_id: String
})

const User = mongoose.model("users", userSchema);

module.exports = User;