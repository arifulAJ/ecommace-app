// controllers/adminController.js
const Product = require('../models/Product');

const approveProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found', status: 'Failed' });
    }

    product.isApproved = true;
    await product.save();

    res.status(200).json({ message: 'Product approved successfully', status: 'OK' });
  } catch (error) {
    console.log('Error in approveProduct:', error);
    res.status(500).json({ message: error.message, status: 'Server Error' });
  }
};


// controllers/adminController.js
const Product = require('../models/Product');

const denyProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found', status: 'Failed' });
    }

    await product.remove();

    res.status(200).json({ message: 'Product denied and removed successfully', status: 'OK' });
  } catch (error) {
    console.log('Error in denyProduct:', error);
    res.status(500).json({ message: error.message, status: 'Server Error' });
  }
};

module.exports = {
  denyProduct,
  approveProduct
};
