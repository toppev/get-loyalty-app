import { Button, ButtonProps } from "@material-ui/core";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Product from "../../products/Product";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: '15px 0px'
        },
        selectedCount: {
            marginLeft: '5px', // is this ok?
            color: theme.palette.grey[700],
        }
    }));


interface SelectProductsButtonProps {
    buttonProps?: ButtonProps,
    products?: Product[]
}

export default function ({ buttonProps, products }: SelectProductsButtonProps) {

    const classes = useStyles();

    return (
        <Button
            className={classes.button}
            size="small"
            color="primary"
            startIcon={(<FastfoodIcon/>)}
            {...buttonProps}
        >Select Products
            <span className={classes.selectedCount}>{products ? ` (${products.length || 'all'} selected)` : ''}</span>
        </Button>)
}