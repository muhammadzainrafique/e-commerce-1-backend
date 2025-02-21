const db = require('../config/connection'); // MySQL connection instance

class OrderModel {
  static async createOrder({
    user_id,
    total_price,
    order_status,
    tracking_id,
  }) {
    const [result] = await db.query(
      'INSERT INTO orders (user_id, total_price, order_status, tracking_id) VALUES (?, ?, ?, ?)',
      [user_id, total_price, order_status, tracking_id]
    );
    return result.insertId;
  }

  static async getOrderById(order_id) {
    const [rows] = await db.query('SELECT * FROM orders WHERE order_id = ?', [
      order_id,
    ]);
    return rows[0];
  }

  static async getAllOrders() {
    const [rows] = await db.query('SELECT * FROM orders');
    return rows;
  }

  static async createOrderItem({ order_id, product_id, quantity, price }) {
    const [result] = await db.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order_id, product_id, quantity, price]
    );
    return result.insertId;
  }

  static async getOrderItems(order_id) {
    const [rows] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order_id]
    );
    return rows;
  }

  // Get orders of a specific user
static async getOrdersByUserId(user_id) {
  const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [user_id]);
  return rows;
}

// Update order status
static async updateOrderStatus(order_id, order_status) {
  const [result] = await db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [order_status, order_id]);
  return result.affectedRows > 0;
}

}

module.exports = OrderModel;
