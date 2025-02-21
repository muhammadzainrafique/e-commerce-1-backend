const db = require('../config/connection');

class ProductModel {
  static async getAllProducts({
    filters = {},
    sort = {},
    pagination = {},
  } = {}) {
    let query = 'SELECT * FROM products';
    const conditions = [];
    const params = [];

    // Filters
    if (filters.name) {
      conditions.push('name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.minPrice) {
      conditions.push('price >= ?');
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      conditions.push('price <= ?');
      params.push(filters.maxPrice);
    }
    if (filters.inStock) {
      conditions.push('stock > 0');
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Sorting
    if (sort.field && sort.order) {
      query += ` ORDER BY ${sort.field} ${
        sort.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      }`;
    }

    // Pagination
    if (pagination.limit && pagination.page) {
      const offset = (pagination.page - 1) * pagination.limit;
      query += ` LIMIT ${offset}, ${pagination.limit}`;
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getProductById(id) {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE product_id = ?',
      [id]
    );
    return rows[0];
  }

  static async createProduct({
    name,
    price,
    description,
    stock,
    image_url,
    createdAt: created_at,
    updatedAt: updated_at,
    product_id,
  }) {
    try {
      const [result] = await db.query(
        'INSERT INTO products (name, price, description, stock, image_url, created_at,updated_at, product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          price,
          description,
          stock,
          image_url,
          created_at,
          updated_at,
          product_id,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.log('Error in creating product', error);
    }
  }

  static async updateProduct(id, updates) {
    try {
      // Extract keys and values from the updates object
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      console.log({updates});
  
      // Build the query dynamically
      const setClause = fields.map((field) => `${field} = ?`).join(', ');
  
      // Add the product ID to the values array
      values.push(id);
  
      // Execute the query
      const query = `UPDATE products SET ${setClause} WHERE product_id = ?`;
      await db.query(query, values);
  
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error in updating product:', error);
    }
  }
  

  static async deleteProduct(id) {
    console.log("I am called");
    await db.query('DELETE FROM products WHERE product_id = ?', [id]);
  }
}

module.exports = ProductModel;
