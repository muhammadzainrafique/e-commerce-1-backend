const OrderModel = require('../model/orderModel');
const UserModel = require('../model/userModel');
const { uuidToInt } = require('./userController');

class OrderController {
  // Create a new order
  static async createOrder(req, res) {
    try {
      const { user_id, total_price,  items } = req.body;

      const order_status = "pending";
      const tracking_id = uuidToInt();

      if (!user_id || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data' });
      }

      // Create the order
      const order_id = await OrderModel.createOrder({
        user_id,
        total_price,
        order_status,
        tracking_id,
      });

      // Insert order items
      for (const item of items) {
        await OrderModel.createOrderItem({
          order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        });
      }

      res.status(201).json({ message: 'Order created successfully', order_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get a single order by ID
static async getOrder(req, res) {
  try {
    const { order_id } = req.params;
    const order = await OrderModel.getOrderById(order_id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}


  // Get a single order with its products
  static async getOrderWithProducts(req, res) {
    try {
      const { order_id } = req.params;
      const order = await OrderModel.getOrderById(order_id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Get order items (products)
      const orderItems = await OrderModel.getOrderItems(order_id);

      res.json({ order, products: orderItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getAdminOrderWithProducts(req, res) {
    try {
      const { order_id } = req.params;
      const order = await OrderModel.getOrderById(order_id);
      const user = await UserModel.getUserById(order.user_id); 

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Get order items (products)
      const orderItems = await OrderModel.getOrderItems(order_id);

      res.json({ order,user, products: orderItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get all orders (Admin feature)
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get previous orders of a specific user
  static async getUserOrders(req, res) {
    try {
      const { user_id } = req.params;
      const orders = await OrderModel.getOrdersByUserId(user_id);

      if (!orders.length) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }

      // Fetch products for each order
      for (const order of orders) {
        order.products = await OrderModel.getOrderItems(order.order_id);
      }

      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Update order status (Admin feature)
  static async updateOrderStatus(req, res) {
    try {
      const { order_id } = req.params;
      const { order_status } = req.body;

      const updated = await OrderModel.updateOrderStatus(order_id, order_status);

      if (updated) {
        res.json({ message: 'Order status updated successfully' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Cancel an order
  static async cancelOrder(req, res) {
    try {
      const { order_id } = req.params;

      const updated = await OrderModel.updateOrderStatus(order_id, 'cancelled');

      if (updated) {
        res.json({ message: 'Order cancelled successfully' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = OrderController;
