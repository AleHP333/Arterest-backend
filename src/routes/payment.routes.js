const { Router } = require("express");
const {
  createOrder,
  captureOrder,
  cancelPayment,
  toFulfilled
} = require("../controllers/payment.controller");

const router = Router();

router.post("/create-order/:id", createOrder);

router.get("/capture-order", captureOrder);

router.get("/cancel-order/:id", cancelPayment);

router.get("/purchase-order/:id", toFulfilled);

module.exports = router
