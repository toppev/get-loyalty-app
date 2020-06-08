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
 * @param {any} businessId the business's _id field
 */
async function getAllById(businessId, populate) {
    const res = Product.find({ business: businessId });
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
 * @param {*} businessId the business's _id field
 * @param {*} product the product to save
 */
async function create(businessId, product) {
    const business = await Business.findById(businessId);
    const limit = business.plan.limits.products.total;
    if (limit !== -1 && await Product.countDocuments({ business: businessId }) >= limit) {
        throw new StatusError('Plan limit reached', 402)
    }
    product.business = businessId;
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