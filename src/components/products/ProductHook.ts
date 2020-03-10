import { useContext, useState } from "react";
import { patch, post, remove } from "../../config/axios";
import AppContext from "../../context/AppContext";
import Product from "./Product";


/**
 * Hook to get operations to update products.
 * 
 * @param saveUpdates whether changes to the products should be sent to the server, false by default
 * @param onFailure the function that is called when there is an error saving the files (e.g network failure). Only called if saveUpdates is true.
 * The message is a custom message that describes the error. The error is the error and retry is a function that will retry the operation if called.
 * 
 * Note: Using _setProducts will not send any changes (use it to load the initial products for example)! addProducts, deleteProduct, updateProduct etc. will send updates.
 */
export function useProductOperations(saveUpdates = false, onFailure: (message: string, error: any, retry: () => any) => any = (msg, err, retry) => { }) {

  const businessId = useContext(AppContext).business._id;
  const subUrl = `/business/${businessId}/product`
  const [products, setProducts] = useState<Product[]>([]);

  const sendProductAdd = (product: Product) => {
    post(subUrl, product)
      .then(res => {
        // Or should we just add all at once?
        setProducts([product, ...products]);
      })
      .catch(err => {
        console.log(err)
        // Show the error and possibly retry
        onFailure("Failed to create a product", err, () => sendProductAdd(product));
      })
  }

  const addProducts = (newProducts: Product[]) => {
    if (saveUpdates) {
      newProducts.forEach(sendProductAdd)
    } else {
      setProducts([...newProducts, ...products]);
    }
  }


  const sendProductDelete = (product: Product) => {
    remove(`${subUrl}/${product._id}`)
      .then(res => {
        setProducts(products.filter(p => p !== product));
      })
      .catch(err => {
        console.log(err);
        onFailure("Failed to delete a product", err, () => sendProductDelete(product));
      })
  }

  const deleteProduct = (product: Product) => {
    if (saveUpdates) {
      sendProductDelete(product);
    } else {
      setProducts(products.filter(p => p !== product));
    }
  }


  const sendProductUpdate = (product: Product) => {
    patch(`${subUrl}/${product._id}`, product)
      .then(res => {
        setProducts(products.map(el => el._id === product._id ? product : el));
      })
      .catch(err => {
        console.log(err);
        onFailure("Failed to update a product", err, () => sendProductUpdate(product));
      })
  }

  const updateProduct = (product: Product) => {
    if (saveUpdates) {
      sendProductUpdate(product);
    } else {
      setProducts(products.map(el => el._id === product._id ? product : el));
    }
  }

  return { products, _setProducts: setProducts, addProducts, deleteProduct, updateProduct }
}