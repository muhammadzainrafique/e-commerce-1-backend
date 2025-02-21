const UserModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken'); // For creating JSON Web Tokens (JWT)

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

 function uuidToInt() {
  id = uuid();
  const uuidNoDashes = id.replace(/-/g, '');
  // Convert first 16 characters of the UUID (128-bit) into a 64-bit integer
  return parseInt(uuidNoDashes.slice(0, 16), 16);
}

// Register a new user
async function register(req, res) {
  const { full_name, email, password, contact, address } = req.body;

  if (!full_name || !email || !password || !contact) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidToInt();
    // Create user
    const user_id = await UserModel.createUser({
      full_name,
      email,
      password_hash: hashedPassword,
      contact,
      address,
      user_id: id,
    });

    res.status(201).json({ message: 'User created successfully', user_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Login a user
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare hashed password with the one in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userInfo: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
        },
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get user details
async function getUser(req, res) {
  const user_id = req.params.user_id;

  try {
    const user = await UserModel.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Get user details
async function getAllUser(req, res) {
  try {
    const user = await UserModel.getAllUser();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update user information
async function updateUser(req, res) {
  const user_id = req.params.user_id;

  try {
    await UserModel.updateUser(user_id, req.body);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete user account
async function deleteUser(req, res) {
  const user_id = req.params.user_id;

  try {
    await UserModel.deleteUser(user_id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('token'); // Clear token if stored in cookies
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
  getAllUser,
  logout,
  uuidToInt
};
