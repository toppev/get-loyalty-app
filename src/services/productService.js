const Product = require('../models/product');
const Business = require('../models/business');
const StatusError = require('../helpers/statusError');

module.exports = {
    getAllById,
    getById,
    create,
    update,
    deleteProduct
}

/**
 * Get all products created by this business
 */
async function getAllById(populate) {
    const res = Product.find();
    if (populate) {
        res.populate();
    }
    return await res;
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
 * @param {*} product the product to save
 */
async function create(product) {
    const business = await Business.findOne();
    const limit = business.plan.limits.products.total;
    if (limit !== -1 && await Product.countDocuments() >= limit) {
        throw new StatusError('Plan limit reached', 402)
    }
    return Product.create(product);
}

/**
 * Update an existing product. Returns the updated product
 * @param {any} productId the product's _id field
 * @param {Object} updatedProduct an object with the values to update
 */
async function update(productId, updatedProduct) {
    const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
    return product;
}

/**
 * Delete an existing product from the database
 * @param {any} productId the product's _id field
 */
async function deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId)
}