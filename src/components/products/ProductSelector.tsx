import { Dialog, IconButton, DialogContent, Typography, DialogContentText, Button } from "@material-ui/core"; import React, { useState } from "react"; import classes from "*.module.css"; import ProductContext from "./ProductContext"; import ProductRow from "./ProductRow"; import ProductFormDialog from "./ProductFormDialog"; import Product from "./Product";
import CloseIcon from '@material-ui/icons/Close';


interface ProductSelectorProps {
    open: boolean
    text: string
    onClickClose: () => any
    onSubmit: (products: Product[]) => any
}

export default function ({ open, text, onClickClose, onSubmit }: ProductSelectorProps) {

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

    return (
        <Dialog open={open} fullWidth={true}>
            <IconButton className={classes.closeButton} aria-label="close" onClick={onClickClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Typography component="h1" variant="h5">Preview Products</Typography>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>

                <ProductContext.Consumer>
                    {({ products }) => (
                        <>
                            <Button
                                className={classes.submitButton}
                                variant="outlined"
                                onClick={() => setSelectedProducts(products)}
                            >Select All</Button>
                            <p>You don't need to select all products. Instead, leave it empty and all products are assumed!</p>
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
                                                        onClick={() => setSelectedProducts(selectedProducts.filter(p => p._id === item._id))}
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
                        </>
                    )}
                </ProductContext.Consumer>

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
