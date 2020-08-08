const Product = require('../models/product');
const Business = require('../models/business');
const StatusError = require('../helpers/statusError');

module.exports = {
    getAllProducts: getAll,
    getById,
    create,
    update,
    deleteProduct
}

/**
 * Get all products created by this business
 */
async function getAll(populate) {
    const res = Product.find();
    if (populate) {
        res.populate('categories');
    }
    return await res;
}

/**
 * Get a product by its id
 * @param {any} productId the product's _id field
 */
async function getById(productId) {
    return Product.findById(productId).populate('categories');
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
    const product = await getById(productId);
    Object.assign(product, updatedProduct);
    return product.save();
}

/**
 * Delete an existing product from the database
 * @param {any} productId the product's _id field
 */
async function deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId)
}