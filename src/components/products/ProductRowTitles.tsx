import { Button, createStyles, ListItem, ListItemIcon, ListItemText, makeStyles, Theme } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import React, { useContext, useState } from 'react';
import Product from './Product';
import ProductContext from './ProductContext';
import ProductFormDialog from './ProductFormDialog';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rowDiv: {
            color: 'lightgray',
            borderBottom: '2px solid black'
        },
        productItem: {

        },
        itemIcon: {

        },
        itemName: {
            margin: '5px',
        },
        itemDesc: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
            margin: '5px'
        },
        itemId: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
            fontSize: '0.75em',
            margin: '3px 0px 0px 0px'
        },
        editBtn: {
            margin: '15px 10px 0px 0px'
        },
        removeBtn: {
            margin: '15px 0px 0px 0px'
        }
    }));


export default function () {

    const classes = useStyles();

    const context = useContext(ProductContext);

    const [editOpen, setEditOpen] = useState(false);

    return (
        <div className={classes.rowDiv}>
            {/* Currently not used */}
        </div>
    )
}