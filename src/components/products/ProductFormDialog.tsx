import { Dialog, DialogContent } from "@material-ui/core";
import React from "react";
import ProductForm, { ProductFormProps } from "./ProductForm";
import CloseButton from "../common/button/CloseButton";


export interface ProductFormDialogProps extends ProductFormProps {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLElement>) => void,
}

export default function (props: ProductFormDialogProps) {

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