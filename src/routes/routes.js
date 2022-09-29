const { Router } = require("express");
const router = Router();

//IMPORTS
const createProduct = require("./route/productRoutes")
const { filterProducts } = require("../helpers/filter");
const likeComments = require("./route/likeCommentRoutes")
const userSign = require("./route/userSignRoutes")
const adminActions = require("./route/adminRoutes")
const artistActions = require("./route/artistRoutes")

router.use("/paints", createProduct)

router.use("/searchFilters", filterProducts)

router.use("/userSign", userSign)

router.use("/likeComments", likeComments)

router.use("/adminActions", adminActions)

router.use("/artist", artistActions)

module.exports = router;