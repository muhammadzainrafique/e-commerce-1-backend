const db = require('../config/connection');

class CartModel {
  static async createCart(user_id) {
    const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [
      user_id,
    ]);
    ``;
    return result.insertId;
  }

  static async getCartByUserId(user_id) {
    console.log('i am called', user_id);
    const [rows] = await db.query('SELECT * FROM cart WHERE user_id = ?', [
      user_id,
    ]);
    return rows[0];
  }

  static async addItemToCart({ cart_id, product_id, quantity }) {
    const [result] = await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [cart_id, product_id, quantity]
    );
    return result.insertId;
  }

  static async getCartItems(cart_id) {
    const [rows] = await db.query(
      `SELECT 
          ci.cart_item_id, 
          ci.quantity, 
          ci.product_id, 
          p.name, 
          p.description, 
          p.image_url, 
          p.price 
       FROM cart_items ci
       INNER JOIN products p ON ci.product_id = p.product_id
       WHERE ci.cart_id = ?`,
      [cart_id]
    );
    return rows;
  }

  static async updateCartItem(cart_item_id, quantity) {
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
      [quantity, cart_item_id]
    );
  }

  static async removeCartItem(cart_item_id) {
    await db.query('DELETE FROM cart_items WHERE cart_item_id = ?', [
      cart_item_id,
    ]);
  }
}

module.exports = CartModel;
