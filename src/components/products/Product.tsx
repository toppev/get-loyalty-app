import React, { Component } from 'react'
import { ListItem, WithStyles, createStyles, Theme, withStyles, ListItemIcon, ListItemText } from '@material-ui/core'
import FastfoodIcon from '@material-ui/icons/Fastfood';

interface ItemProps {
    product: {
        name: String,
        description: String
    }

}

const styles = (theme: Theme) =>
    createStyles({
        productItem: {
            backgroundColor: 'darkslategray',
        },
        itemText: {

        },
        itemIcon: {

        }
    });

export interface ProductProps extends Omit<ItemProps, 'classes'>, WithStyles<typeof styles> { }

function Product(props: ProductProps) {
    const { classes, ...other } = props;

    return (
        <div>
            <ListItem className={classes.productItem}>
                <ListItemIcon className={classes.itemIcon}>
                    <FastfoodIcon />
                </ListItemIcon>
                <ListItemText classes={{ primary: classes.itemText, }}>
                    {other.product.name}
                </ListItemText>
            </ListItem>
        </div>
    )
}

export default withStyles(styles)(Product);