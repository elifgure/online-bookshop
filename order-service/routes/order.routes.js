const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const {createOrderRules, validate} = require('../middleware/validateOrder')

// Yeni sipariş oluşturma
router.post('/', createOrderRules, validate, orderController.createOrder);

// Sipariş detayı alma
router.get('/:id', orderController.getOrderById);

module.exports = router;
