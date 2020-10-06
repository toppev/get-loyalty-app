import { get, patch, post, remove } from "../config/axios";
import Product from "../components/products/Product";


function listProducts() {
    const subUrl = `/product`
    return get(`${subUrl}/all`);
}

function addProduct(product: Product) {
    const subUrl = `/product`
    return post(subUrl, product);
}

function deleteProduct(product: Product) {
    const subUrl = `/product`
    return remove(`${subUrl}/${product.id}`)
}

function updateProduct(product: Product) {
    const subUrl = `/product`
    return patch(`${subUrl}/${product.id}`, product)
}

export {
    listProducts,
    addProduct,
    deleteProduct,
    updateProduct
};
