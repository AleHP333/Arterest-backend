const { Router } = require("express");
const {
  createOrder,
  captureOrder,
  cancelPayment,
} = require("../controllers/payment.controller");

const router = Router();

router.post("/create-order", createOrder);

router.get("/capture-order", captureOrder);

router.get("/cancel-order", cancelPayment);

module.exports = router
