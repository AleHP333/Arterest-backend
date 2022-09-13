const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes/routes.js");
const app = express();
const passport = require("passport")


//MIDDLEWARES
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());


//INDEX
app.use("/", router);

module.exports = app;