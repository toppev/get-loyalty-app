import { createStyles, Dialog, DialogContent, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import ProductForm, { ProductFormProps } from "./ProductForm";
import CloseButton from "../common/button/CloseButton";


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
                <CloseButton onClick={props.onClose}/>
                <DialogContent>
                    <ProductForm {...props} />
                </DialogContent>
            </Dialog>
        </div>
    );
}