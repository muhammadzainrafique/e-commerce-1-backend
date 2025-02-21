const express = require('express');
const OrderController = require('../controllers/orderController');
const router = express.Router();

router.post('/', OrderController.createOrder);
router.get('/:order_id', OrderController.getOrder);
router.get('/', OrderController.getAllOrders);
router.get('/user-orders/:user_id', OrderController.getUserOrders);
router.get('/order-with-product/:order_id', OrderController.getOrderWithProducts);


module.exports = router;
