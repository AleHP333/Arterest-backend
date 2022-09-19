require("dotenv").config();
require("./config/mongoose.js")


const server = require("./src/app.js");

const PORT = 3001

server.listen(PORT, () => {
    console.log("Server listening to 3001");
})