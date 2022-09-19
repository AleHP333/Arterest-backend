const mongoose = require("mongoose");
const { MONGUS_URI } = process.env


mongoose.connect( MONGUS_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(console.log("connected to database")).catch(err => console.log(err));