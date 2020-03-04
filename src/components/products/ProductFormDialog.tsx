import { createStyles, Dialog, DialogContent, IconButton, makeStyles, Theme, Typography } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import React from "react";
import ProductForm, { ProductFormProps } from "./ProductForm";


export interface ProductFormDialogProps extends ProductFormProps {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLElement>) => void,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    }));

export default function (props: ProductFormDialogProps) {

    const classes = useStyles();
    return (
        <div>
            <Dialog open={props.open}>
                <IconButton className={classes.closeButton} aria-label="close" onClick={props.onClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <ProductForm {...props} />
                </DialogContent>
            </Dialog>
        </div>
    );
}