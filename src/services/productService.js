const Product = require('../models/product');

module.exports = {
    getAllById,
    getById,
    create,
    update,
    deleteProduct
}

/**
 * Get all products created by this business
 * @param {any} businessId the business's _id field
 */
async function getAllById(businessId) {
    return await Product.find({ business: businessId });
}

/**
 * Get a product by its id
 * @param {any} productId the product's _id field
 */
async function getById(productId) {
    return await Product.findById(productId);
}

/**
 * Create a new product. The business is automatically assigned to the product.
 * @param {*} businessId the business's _id field
 * @param {*} product the product to save
 */
async function create(businessId, product) {
    product.business = businessId;
    return await Product.create(product);
}

/**
 * Update an existing product. Returns the updated product
 * @param {any} productId the product's _id field
 * @param {Object} updatedProduct an object with the values to update 
 */
async function update(productId, updatedProduct) {
    const product = await Product.findByIdAndUpdate(productId, updatedProduct, {new: true});
    return product;
}

/**
 * Delete an existing product from the database
 * @param {any} productId the product's _id field
 */
async function deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId)
}