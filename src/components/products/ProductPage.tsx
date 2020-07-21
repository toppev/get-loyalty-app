import { Box, createStyles, LinearProgress, makeStyles, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import RetryButton from '../common/button/RetryButton';
import ImportProducts from './importer/ImportProducts';
import Product from './Product';
import ProductFormDialog from './ProductFormDialog';
import ProductRow from './ProductRow';
import SearchField from "../common/SearchField";
import NewButton from "../common/button/NewButton";
import { listProducts } from "../../services/productService";
import useRequest from "../../hooks/useRequest";
import useResponseState from "../../hooks/useResponseState";
import useSearch from "../../hooks/useSearch";
import Tip from "../common/Tip";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {},
        productList: {
            paddingLeft: 0,
        },
        tools: {
            marginBottom: '25px',
        },
        newBtn: {
            marginRight: '15px'
        },
        importBtn: {
            backgroundColor: theme.palette.grey[400],
        },
        info: {
            fontSize: '14px',
            color: theme.palette.grey[300],
            marginBottom: '40px'
        },
        noProducts: {
            color: theme.palette.grey[600],
        }
    }));

export default function () {

    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();

    const { search, setSearch, searchFilter } = useSearch()

    const { error: errorListing, loading: listing, response } = useRequest(listProducts);
    const [products, setProducts] = useResponseState<Product[]>(response, [], res => res.data.map((it: any) => new Product(it)));
    const otherRequest = useRequest();

    const classes = useStyles();
    const error = errorListing || otherRequest.error;
    const loading = listing || otherRequest.loading;

    const filteredProducts = products.filter(searchFilter)

    return (
        <div>
            {error ? (
                <RetryButton error={error}/>
            ) : (<div className={classes.paper}>

                <div className={classes.info}>
                    <p>Create or import existing products from a .csv file here.</p>
                    <Tip>
                        You don't have to create all products.
                        You can create generic products, for example "Pizza", "Vegan burgers" or "Men's haircut".
                    </Tip>
                </div>

                <Box display="flex" className={classes.tools}>
                    <NewButton
                        name="New Product"
                        buttonProps={{
                            className: classes.newBtn,
                            onClick: () => setFormOpen(true)
                        }}
                    />
                    <ImportProducts className={classes.importBtn} variant="contained"/>
                </Box>

                <SearchField
                    setSearch={setSearch}
                    name={"product_search"}
                    placeholder={"Search products..."}
                />

                {loading && <LinearProgress/>}

                <ul className={classes.productList}>
                    {filteredProducts.map((item, index) => (
                        <ProductRow
                            key={index}
                            product={item}
                            startEditing={product => setEditingProduct(product)}
                            onDelete={() => setProducts(products.filter(p => p.id !== item.id))}
                        />
                    ))}
                </ul>

                <p className={classes.noProducts}>{filteredProducts.length == 0 && (products.length == 0
                    ? "You don't have any products"
                    : "No products found")}</p>


                <ProductFormDialog
                    open={formOpen || !!editingProduct}
                    initialProduct={editingProduct}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }}
                    onProductSubmitted={(product: Product) => {
                        setProducts([...products.filter(it => it.id !== product.id), product])
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }}/>

            </div>)
            }
        </div>
    )
}