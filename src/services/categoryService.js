const Category = require('../models/category');

module.exports = {
    create,
    find,
    findById
}


/**
 * Create a new category
 * @param {Any} categoryParam the initial params, "official" key is always false in the returned category object
 */
async function create(categoryParam) {
    const category = new Category(categoryParam);
    // Won't use this for creating the official categories so just force it here
    category.official = false;
    await category.save();
    return category;
}

/**
 * Find categories whose name or keywords contain the query
 * @param {string} query the query string to search, ignored if it's null/undefined
 * @param {number} limit limit of returned categories 
 */
async function find(query, limit = 100) {
    const dbQyery = query ? {
        official: true,
        $or: [{ keywords: query }, { name: query }]
    } : { official: true }

    const categories = await Category.find(dbQyery).limit(limit);

    return categories;
}

/**
 * Find a category by the given id
 * @param {Any} id the category id
 */
async function findById(id) {
    return await Category.findById(id);
}