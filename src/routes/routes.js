const { Router } = require("express");
const router = Router();

//IMPORTS
const createProduct = require("./route/productRoutes")
const { filterProducts } = require("../helpers/filter");

router.use("/paints", createProduct)

router.use("/searchFilters", filterProducts)

module.exports = router;