const ProductModel = require('../model/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      inStock: req.query.inStock === 'true',
    };

    const sort = {
      field: req.query.sortField,
      order: req.query.sortOrder,
    };

    const pagination = {
      limit: parseInt(req.query.limit, 10),
      page: parseInt(req.query.page, 10),
    };

    const products = await ProductModel.getAllProducts({
      filters,
      sort,
      pagination,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, stock, image_url, price } = req.body;
    const createdAt = new Date();
    const updatedAt = new Date();
    const product_id = Math.floor(1000 + Math.random() * 9000);
    if (!name || !description || !stock || !image_url || !price) {
      return res.status(400).json({ error: 'Please provide all the details' });
    }
    const productId = await ProductModel.createProduct({
      name,
      description,
      stock,
      image_url,
      price,
      createdAt,
      updatedAt,
      product_id,
    });
    res.status(201).json({ id: productId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated_at = new Date();
    console.log({obj:req.body});
    const obj = {
      ...req.body,
      updated_at,
    };
    await ProductModel.updateProduct(id, obj);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductModel.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
