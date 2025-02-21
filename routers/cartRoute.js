const express = require('express');
const CartController = require('../controllers/cartController');
const router = express.Router();

router.get('/:user_id', CartController.getCart);
router.post('/add', CartController.addItem);
router.patch('/:cart_item_id', CartController.updateItem);
router.delete('/:cart_item_id', CartController.removeItem);

module.exports = router;
