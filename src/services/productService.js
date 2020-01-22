const Product = require('../models/product');

module.exports = {
    getAllById,
    getById,
    create,
    update,
    deleteProduct
}

async function getAllById(businessId) {
    return await Product.find({ business: businessId });
}

async function getById(productId) {
    return await Product.findById(productId);
}

async function create(businessId, product) {
    product.business = businessId;
    return await Product.create(product);
}

async function update(productId, updatedProduct) {
    const product = await Product.findByIdAndUpdate(productId, updatedProduct, {new: true});
    return product;
}

async function deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId)
}