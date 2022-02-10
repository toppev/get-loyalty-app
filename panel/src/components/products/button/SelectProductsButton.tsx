import { Button, ButtonProps } from "@mui/material"
import FastfoodIcon from "@mui/icons-material/Fastfood"
import React from "react"
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Product from "../Product"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: '15px 0px'
    },
    selectedCount: {
      marginLeft: '5px', // is this ok?
      color: theme.palette.grey[700],
    }
  }))


interface SelectProductsButtonProps {
  buttonProps?: ButtonProps,
  products?: Product[]
}

export default function ({ buttonProps, products }: SelectProductsButtonProps) {

  const classes = useStyles()

  return (
    <Button
      className={classes.button}
      size="small"
      color="primary"
      startIcon={(<FastfoodIcon/>)}
      {...buttonProps}
    >
      Select Products
      <span className={classes.selectedCount}>{products ? ` (${products.length || 'all'} selected)` : ''}</span>
    </Button>)
}
