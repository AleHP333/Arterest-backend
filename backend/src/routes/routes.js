const { Router } = require("express");
const router = Router();

//IMPORTS

router.use("/", (req, res) => {res.send("hola")});

module.exports = router;