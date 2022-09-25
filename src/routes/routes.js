const { Router } = require("express");
const router = Router();

//IMPORTS
const createProduct = require("./route/productRoutes")
const { filterProducts } = require("../helpers/filter");
const likeComments = require("./route/likeCommentRoutes")
const userSign = require("./route/userSignRoutes")
const adminActions = require("./route/adminRoutes")
const users = require("./route/userRoutes")

router.use("/paints", createProduct)

router.use("/searchFilters", filterProducts)

router.use("/userSign", userSign)

router.use("/likeComments", likeComments)

router.use("/adminActions", adminActions)

router.use("/users", users)

module.exports = router;