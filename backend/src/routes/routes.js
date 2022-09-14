const { Router } = require("express");
const router = Router();

//IMPORTS
const createProduct = require("./route/productRoutes")

router.use("/paints", createProduct)

module.exports = router;