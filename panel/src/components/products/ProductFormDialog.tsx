import { Dialog, DialogContent } from "@mui/material"
import React from "react"
import ProductForm, { ProductFormProps } from "./ProductForm"
import CloseButton from "../common/button/CloseButton"


export interface ProductFormDialogProps extends ProductFormProps {
  open: boolean,
  onClose: (event: React.MouseEvent<HTMLElement>) => void,
}

export default function ProductFormDialog(props: ProductFormDialogProps) {

  return (
    <div>
      <Dialog open={props.open}>
        <CloseButton onClick={props.onClose}/>
        <DialogContent>
          <ProductForm {...props} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
