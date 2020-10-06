import { Button, createStyles, Dialog, DialogContent, DialogContentText, LinearProgress, Theme, Typography } from "@material-ui/core";
import React, { useState } from "react";
import ProductRow from "./ProductRow";
import Product from "./Product";
import { makeStyles } from "@material-ui/core/styles";
import CloseButton from "../common/button/CloseButton";
import useRequest from "../../hooks/useRequest";
import { listProducts } from "../../services/productService";
import RetryButton from "../common/button/RetryButton";
import useResponseState from "../../hooks/useResponseState";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        closeButton: {
            position: 'absolute',
            color: theme.palette.grey[500],
        },
        submitDiv: {
            textAlign: 'center',
        },
        submitButton: {
            margin: '5px',
        },
        selectBtn: {
            margin: '5px',
        },
        headerDiv: {
            textAlign: 'center'
        },
        info: {
            textAlign: 'center',
            fontSize: '12px',
            margin: '12px',
            color: theme.palette.grey[800]
        }
    }));

interface ProductSelectorProps {
    open: boolean
    text: string
    onClickClose: () => any
    onSubmit: (products: Product[]) => any
    limitNotification?: number
}


export default function ({ open, text, onClickClose, onSubmit, limitNotification }: ProductSelectorProps) {

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const { error, loading, response } = useRequest(() => listProducts());
    const [products] = useResponseState<Product[]>(response, [], res => res.data.map((it: any) => new Product(it)));

    const classes = useStyles();

    return error ? (
        <RetryButton error={error}/>
    ) : (
        <Dialog open={open} fullWidth={true}>
            <CloseButton onClick={onClickClose}/>
            <DialogContent>
                <div className={classes.headerDiv}>
                    <Typography component="h1" variant="h5">Products</Typography>
                    <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
                </div>
                <div>
                    {selectedProducts.length > 0 &&
                    <Button
                        className={classes.selectBtn}
                        variant="outlined"
                        onClick={() => setSelectedProducts([])}
                    >Deselect All</Button>}

                    <div className={classes.info}>
                        {products.length > 0 &&
                        <p>You don't need to select all products. Instead, leave it empty and all products are
                            assumed!</p>}
                        {loading && <LinearProgress/>}
                        {!loading && products.length === 0 &&
                        <p>You don't have any products. You can add a few products on <a
                            href={'/products'}>this</a> page</p>}
                    </div>
                    <ul>
                        {products
                            .map((item, index) =>
                                <ProductRow
                                    key={index} product={item}
                                    CustomActions={selectedProducts.includes(item) ?
                                        (
                                            <Button
                                                className={classes.submitButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setSelectedProducts(selectedProducts.filter(p => p.id !== item.id))}
                                            >Deselect</Button>
                                        ) : (
                                            <Button
                                                className={classes.submitButton}
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    if (selectedProducts.length !== limitNotification || window.confirm('We highly recommend only selecting a few products if possible. Click OK to continue selecting more.')) {
                                                        setSelectedProducts([item, ...selectedProducts])
                                                    }
                                                }}
                                            >Select</Button>
                                        )}
                                />)
                        }
                    </ul>
                </div>

                <div className={classes.submitDiv}>

                    <Button
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        onClick={() => onSubmit(selectedProducts)}
                    >Confirm Selection</Button>

                    <Button
                        className={classes.submitButton}
                        variant="outlined"
                        color="secondary"
                        onClick={onClickClose}
                    >Cancel</Button>
                </div>
            </DialogContent>

        </Dialog>
    )
}
