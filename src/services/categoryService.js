const Category = require('../models/category');

module.exports = {
    create,
    find,
    findById
}


/**
 * Create a new category
 * @param {any} categoryParam the initial params, "official" key is always false in the returned category object
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
 * @param {string} type to search ('product', 'service', 'business' or null)
 */
async function find(query, type, limit = 100) {
    // Whether the type was specified
    const typeQuery = type ? {
        official: true,
        categoryType: type
    } : { official: true }
    // Whether the query was specified
    const finalQuery = query ? {
        $or: [{ keywords: query }, { name: query }],
        ...typeQuery
    } : { ...typeQuery }

    const categories = await Category.find(finalQuery).limit(limit);

    return categories;
}

/**
 * Find a category by the given id
 * @param {any} id the category id
 */
async function findById(id) {
    return await Category.findById(id);
}