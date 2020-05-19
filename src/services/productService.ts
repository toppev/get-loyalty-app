import { BUSINESS_ID, get, patch, post, remove } from "../config/axios";
import Product from "../components/products/Product";


function listProducts() {
    const subUrl = `/business/${BUSINESS_ID}/product`
    return get(`${subUrl}/all`);
}

function addProduct(product: Product) {
    const subUrl = `/business/${BUSINESS_ID}/product`
    return post(subUrl, product);
}

function deleteProduct(product: Product) {
    const subUrl = `/business/${BUSINESS_ID}/product`
    return remove(`${subUrl}/${product._id}`)
}

function updateProduct(product: Product) {
    const subUrl = `/business/${BUSINESS_ID}/product`
    return patch(`${subUrl}/${product._id}`, product)
}

export {
    listProducts,
    addProduct,
    deleteProduct,
    updateProduct
};
