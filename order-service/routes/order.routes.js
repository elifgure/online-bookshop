const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Yeni sipariş oluşturma
router.post('/', (req, res, next) => {
  console.log("📩 Route POST /api/orders çalıştı");
  next();
}, orderController.createOrder);

// Sipariş detayı alma
router.get('/:id', orderController.getOrderById);

module.exports = router;
