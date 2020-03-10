import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import React, { useContext, useState } from 'react';
import Product from './Product';
import ProductContext from './ProductContext';
import ProductFormDialog from './ProductFormDialog';

interface Props {
    product: Product
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rowDiv: {
            backgroundColor: 'ghostwhite',
            marginBottom: '5px',
            padding: '5px 25px 5px 0px'
        },
        paper: {

        },
        productItem: {

        },
        itemIcon: {

        },
        icon: {
            marginLeft: '8px'
        },
        itemName: {
            margin: '5px',
        },
        itemDesc: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        categories: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        editBtn: {
            margin: '10px 5px 5px 0px',
            width: '75px'
        },
        removeBtn: {
            margin: '10px 0px 5px 0px',
            width: '75px'
        }
    }));


export default function (props: Props) {

    const classes = useStyles();

    const context = useContext(ProductContext);

    const [editOpen, setEditOpen] = useState(false);

    return (
        <div className={classes.rowDiv}>

            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={1} sm={1}>
                    <FastfoodIcon className={classes.icon} />
                </Grid>
                <Grid item xs={2} sm={2}>
                    <b>{props.product.name}</b>
                </Grid>
                <Grid item sm={3} className={classes.itemDesc}>
                    {props.product.description}
                </Grid>
                <Grid item xs={1} sm={1}>
                    {props.product.price}
                </Grid>
                <Grid item xs={2} sm={2} className={classes.categories}>
                    {props.product.categories.map(c => c.name).join(", ")}
                </Grid>
                <Grid item xs={2} sm={2}>
                    <Button className={classes.editBtn}
                        onClick={() => {
                            setEditOpen(!editOpen)
                        }}
                        variant="contained" color="primary">Edit</Button>
                    <Button className={classes.removeBtn} onClick={() => {
                        if (window.confirm('Do you want to delete the item? This action is irreversible.')) {
                            context.deleteProduct(props.product);
                        }
                    }} variant="contained" color="secondary">Delete</Button>
                </Grid>
            </Grid>

            <ProductFormDialog initialProduct={props.product} open={editOpen} onClose={() => setEditOpen(false)} onProductSubmitted={(newProduct: Product) => {
                setEditOpen(false);

                console.log("updated product: " + JSON.stringify(newProduct))
                console.log("old product: " + JSON.stringify(props.product))

                context.updateProduct(newProduct);
            }} />

        </div>
    )
}