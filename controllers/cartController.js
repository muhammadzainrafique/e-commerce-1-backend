const CartModel = require('../model/cartModel');

class CartController {
  static async getCart(req, res) {
    try {
      const { user_id } = req.params;
      const cart = await CartModel.getCartByUserId(user_id);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      const items = await CartModel.getCartItems(cart.cart_id);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Error fetching cart' });
    }
  }

  static async addItem(req, res) {
    try {
      // checking whether the person have cart or not if not create a cart
      const { user_id } = req.body;
      const user_cart = await CartModel.getCartByUserId(user_id);
      if (!user_cart) {
        const cart_id = await CartModel.createCart(user_id);
        req.body.cart_id = cart_id;
      }
      req.body.cart_id = user_cart?.cart_id;
      const { cart_id, product_id, quantity } = req.body;
      await CartModel.addItemToCart({ cart_id, product_id, quantity });
      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ message: 'Error adding item to cart' });
    }
  }

  static async updateItem(req, res) {
    try {
      const { quantity } = req.body;
      const { cart_item_id } = req.params;
      await CartModel.updateCartItem(cart_item_id, quantity);
      res.status(200).json({ message: 'Cart item updated' });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Error updating cart item' });
    }
  }

  static async removeItem(req, res) {
    try {
      const { cart_item_id } = req.params;
      await CartModel.removeCartItem(cart_item_id);
      res.status(200).json({ message: 'Cart item removed' });
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ message: 'Error removing cart item' });
    }
  }
}

module.exports = CartController;
