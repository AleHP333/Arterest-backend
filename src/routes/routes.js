const { Router } = require("express");
const router = Router();

//IMPORTS
const createProduct = require("./route/productRoutes")
const { filterProducts } = require("../helpers/filter");
const likeComments = require("./route/likeCommentRoutes")
const usersRoutes = require("./route/userRoutes")

router.use("/paints", createProduct)

router.use("/searchFilters", filterProducts)

router.use("/users", usersRoutes )

router.use("/likeComments", likeComments)

module.exports = router;