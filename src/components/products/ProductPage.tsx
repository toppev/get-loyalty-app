import { Button, createStyles, InputAdornment, LinearProgress, ListItem, makeStyles, TextField, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import React, { useContext, useEffect, useState } from 'react';
import { get } from '../../config/axios';
import AppContext from '../../context/AppContext';
import RetryButton from '../common/RetryButton';
import ImportProducts from './importer/ImportProducts';
import Product from './Product';
import ProductContext from './ProductContext';
import ProductFormDialog from './ProductFormDialog';
import ProductRow from './ProductRow';


interface State {
    loading: boolean
    error: {}
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // TODO
        paper: {

        },
        productList: {
            paddingLeft: 0,
        },
        search: {
            marginBottom: '25px',
        },
        input: {
            color: theme.palette.common.white,
        },
        inputLabel: {
            color: theme.palette.common.white,
        },
        tools: {
            marginBottom: '10px',
        },
        newBtn: {
            backgroundColor: theme.palette.success.main,
            marginRight: '15px'
        },
        importBtn: {
            backgroundColor: theme.palette.grey[400],
        }
    }));


export default function () {

    const appContext = useContext(AppContext);
    // Whether it should load or is loading
    const [shouldLoad, setShouldLoad] = useState(appContext.loggedIn);
    const [error, setError] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const [search, setSearch] = useState("");

    const searchFilter = (product: Product) => search.length ? JSON.stringify(product).toLowerCase().includes(search) : true;

    const context = useContext(ProductContext);

    const classes = useStyles();

    const fetchData = async () => {
        get(`/business/${appContext.business._id}/product/all`).then(response => {
            setShouldLoad(false);
            context.addProducts(response.data);
        }).catch(error => {
            setShouldLoad(false);
            setError(error);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {shouldLoad ? (
                <LinearProgress />
            ) : error && false && "TODO REMOVE THE FALSE" ? (
                <RetryButton error={error.toString()} callback={async () => await fetchData()} />
            ) : (<div className={classes.paper}>


                <ListItem className={classes.tools}>
                    <Button className={classes.newBtn} variant="contained"
                        startIcon={(<AddIcon />)}
                        onClick={() => setFormOpen(true)}>New Product</Button>
                    <ImportProducts className={classes.importBtn} variant="contained" />
                </ListItem>

                <TextField
                    className={classes.search}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        className: classes.input
                    }}
                    InputLabelProps={{ className: classes.inputLabel }}
                    name="product_search"
                    type="search"
                    placeholder="Search products..."
                    onChange={(e) => setSearch(e.target.value)
                    }
                />
                <ProductContext.Consumer>
                    {({ products }) => (
                        <ul className={classes.productList}>
                            {products
                                .filter(searchFilter)
                                .map((item, index) => <ProductRow startEditing={product => setEditingProduct(product)} key={index} product={item} />)}
                        </ul>
                    )}
                </ProductContext.Consumer>

                <ProductFormDialog
                    open={formOpen || !!editingProduct}
                    initialProduct={editingProduct}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }}
                    onProductSubmitted={(product: Product) => {
                        // Whether it's a new product or editing
                        if (!editingProduct) {
                            context.addProducts([product]);
                        } else {
                            context.updateProduct(product);
                        }
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }} />

            </div>)}
        </div>
    )
}