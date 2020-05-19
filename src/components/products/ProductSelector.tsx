import {
    Button,
    createStyles,
    Dialog,
    DialogContent,
    DialogContentText,
    LinearProgress,
    Theme,
    Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ProductRow from "./ProductRow";
import Product from "./Product";
import { makeStyles } from "@material-ui/core/styles";
import CloseButton from "../common/button/CloseButton";
import useRequest from "../../hooks/useRequest";
import { listProducts } from "../../services/productService";
import RetryButton from "../common/button/RetryButton";


interface ProductSelectorProps {
    open: boolean
    text: string
    onClickClose: () => any
    onSubmit: (products: Product[]) => any
}

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
        }
    }));

export default function ({ open, text, onClickClose, onSubmit }: ProductSelectorProps) {

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const [products, setProducts] = useState<Product[]>([]);

    const { error, loading, response } = useRequest(() => listProducts());

    useEffect(() => {
        if (response?.data) {
            setProducts(response.data)
        }
    }, [response])

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
                    <Button
                        className={classes.selectBtn}
                        variant="outlined"
                        onClick={() => setSelectedProducts(products)}
                    >Select All</Button>
                    {selectedProducts.length > 0 &&
                    <Button
                        className={classes.selectBtn}
                        variant="outlined"
                        onClick={() => setSelectedProducts([])}
                    >Deselect All</Button>}
                    <p>You don't need to select all products. Instead, leave it empty and all products are
                        assumed!</p>

                    {loading && <LinearProgress/>}

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
                                                onClick={() => setSelectedProducts(selectedProducts.filter(p => p._id !== item._id))}
                                            >Deselect</Button>
                                        ) : (
                                            <Button
                                                className={classes.submitButton}
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => setSelectedProducts([item, ...selectedProducts])}
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
