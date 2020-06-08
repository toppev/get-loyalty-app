import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
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
        }
    }));

export default function () {

    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();

    const { search, setSearch, searchFilter } = useSearch()

    const { error: errorListing, loading: listing, response } = useRequest(listProducts);
    const [products, setProducts] = useResponseState<Product[]>(response, []);
    const otherRequest = useRequest();

    const classes = useStyles();
    const error = errorListing || otherRequest.error;
    const loading = listing || otherRequest.loading;

    return (
        <div>
            {error ? (
                <RetryButton error={error}/>
            ) : (<div className={classes.paper}>

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
                <ul className={classes.productList}>
                    {products
                        .filter(searchFilter)
                        .map((item, index) => (
                            <ProductRow
                                key={index}
                                product={item}
                                startEditing={product => setEditingProduct(product)}
                                onDelete={() => setProducts(products.filter(p => p.id !== item.id))}
                            />
                        ))}
                </ul>

                <ProductFormDialog
                    open={formOpen || !!editingProduct}
                    initialProduct={editingProduct}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }}
                    onProductSubmitted={(product: Product) => {
                        setProducts([...products, product])
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }}/>

            </div>)
            }
        </div>
    )
}