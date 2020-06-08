import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import React from 'react';
import Product from './Product';
import useRequest from "../../hooks/useRequest";
import { deleteProduct } from "../../services/productService";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rowDiv: {
            backgroundColor: 'ghostwhite',
            marginBottom: '5px',
            padding: '5px 25px 5px 0px'
        },
        paper: {},
        productItem: {},
        itemIcon: {},
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

interface ProductRowProps {
    product: Product,
    CustomActions?: JSX.Element
    startEditing?: (product: Product) => any
    onDelete?: () => any
}

export default function (props: ProductRowProps) {

    const classes = useStyles();

    return (
        <div className={classes.rowDiv}>

            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={1} sm={1}>
                    <FastfoodIcon className={classes.icon}/>
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
                    {props.CustomActions || <EditDeleteActions {...props} />}
                </Grid>
            </Grid>

        </div>
    )
}

function EditDeleteActions(props: ProductRowProps) {

    const classes = useStyles();

    const { error, loading, response, performRequest } = useRequest();

    return (
        <>
            <Button
                className={classes.editBtn}
                startIcon={(<EditIcon/>)}
                onClick={() => {
                    if (props.startEditing) {
                        props.startEditing(props.product);
                    }
                }}
                variant="contained" color="primary">Edit</Button>
            <Button
                className={classes.removeBtn}
                color="secondary"
                onClick={() => {
                    if (window.confirm('Do you want to delete the item? This action is irreversible.')) {
                        performRequest(
                            () => deleteProduct(props.product),
                            props.onDelete
                        );
                    }
                }}
            >Delete</Button>
        </>
    )

}