import { get, post } from "../config/axios"
import Category from "../components/categories/Category"

function getAllCategories() {
  return get(`/category/`)
}

function createCategory(category: Category) {
  return post('/category', category)
}

/**
 * Create categories if they don't exist yet
 */
async function createCategories(categories: Category[]) {
  return Promise.all(categories.map(async cat => {
    if (cat.id && cat.id.length === 24) {
      // Valid category, return it
      return cat
    }
    // Otherwise create and return the new category
    const res = await createCategory(cat)
    return new Category(res.data)
  }))
}

export {
  getAllCategories,
  createCategories
}
