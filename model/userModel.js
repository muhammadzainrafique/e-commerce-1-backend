const db = require('../config/connection'); // Your MySQL connection pool

class UserModel {
  // Create a new user
  static async createUser({
    full_name,
    email,
    user_id,
    password_hash,
    contact,
    role = 'customer',
    address,
  }) {
    try {
      const created_at = new Date();
      const updated_at = created_at;
      const [result] = await db.query(
        'INSERT INTO users (full_name, email, password_hash, contact, role, address,created_at, updated_at, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          full_name,
          email,
          password_hash,
          contact,
          role,
          address,
          created_at,
          updated_at,
          user_id,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Get user by ID
  static async getUserById(user_id) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [
        user_id,
      ]);
      if (rows[0]) {
        delete rows[0].password_hash; // Remove the password_hash field
      }
      return rows[0];
    } catch (error) {
      console.error('Error in getting user by ID:', error);
      throw new Error('User not found');
    }
  }

  static async getAllUser() {
    try {
      const [rows] = await db.query('SELECT * FROM users ');
      if (rows.length) {
        rows.forEach((row) => {
          delete row.password_hash; // Remove the password_hash field
        })
      }
      return rows;
    } catch (error) {
      console.error('Error in getting user by ID:', error);
      throw new Error('User not found');
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error in getting user by email:', error);
      throw new Error('User not found');
    }
  }

  // Update user information
  static async updateUser(user_id, updates) {
    try {
      const fields = Object.keys(updates);
      const values = Object.values(updates);

      const setClause = fields.map((field) => `${field}=?`).join(', ');
      values.push(user_id);

      const query = `UPDATE users SET ${setClause} WHERE user_id = ?`;
      console.log('Query', query);
      console.log('Values', values);
      await db.query(query, values);
    } catch (error) {
      console.error('Error in updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  // Delete user by ID
  static async deleteUser(user_id) {
    try {
      await db.query('DELETE FROM users WHERE user_id = ?', [user_id]);
    } catch (error) {
      console.error('Error in deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
}

module.exports = UserModel;
