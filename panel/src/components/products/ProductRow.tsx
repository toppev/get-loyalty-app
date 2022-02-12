import { Button, Collapse, IconButton, TableCell, TableRow, Theme } from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import EditIcon from '@mui/icons-material/Edit'
import React, { useState } from 'react'
import Product from './Product'
import useRequest from "../../hooks/useRequest"
import { deleteProduct } from "../../services/productService"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import IdText from "../common/IdText"

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
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    categories: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    editBtn: {
      margin: '10px 5px 5px 0px',
      maxWidth: '75px'
    },
    removeBtn: {
      margin: '10px 0px 5px 0px',
      maxWidth: '75px'
    },
    root: {
      backgroundColor: 'ghostwhite',
      '& > *': {
        borderBottom: 'unset',
      }
    }
  }))

interface ProductRowProps {
  product: Product,
  CustomActions?: JSX.Element
  startEditing?: (product: Product) => any
  onDelete?: () => any
}

export default function ProductRow(props: ProductRowProps) {

  const classes = useStyles()

  const { product } = props

  const [viewing, setViewing] = useState(false)

  return <>
    <TableRow className={classes.rowDiv}>

      <TableCell>
        <IconButton onClick={() => setViewing(!viewing)} size="large">{viewing ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</IconButton>
      </TableCell>
      <TableCell>
        {product.name}
      </TableCell>
      <TableCell>
        {product.description}
      </TableCell>
      <TableCell>
        {product.price}
      </TableCell>
      <TableCell>
        {product.categories.map(c => c.name).join(", ")}
      </TableCell>
      <TableCell>
        {props.CustomActions || <EditDeleteActions {...props} />}
      </TableCell>
      <TableCell>
        <IdText id={product.id} text={false}/>
      </TableCell>
    </TableRow>
    <TableRow className={classes.root}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Collapse in={viewing} timeout="auto" unmountOnExit>
          <div className={classes.root}>
            <div>
              There's nothing here (work in progress)
            </div>
          </div>
        </Collapse>
      </TableCell>
    </TableRow>
  </>
}

function EditDeleteActions(props: ProductRowProps) {

  const classes = useStyles()

  const { performRequest } = useRequest()

  return (
    <>
      <Button
        className={classes.editBtn}
        startIcon={(<EditIcon/>)}
        onClick={() => props.startEditing && props.startEditing(props.product)}
        variant="contained" color="primary">Edit</Button>
      <Button
        className={classes.removeBtn}
        color="secondary"
        onClick={() => {
          if (window.confirm('Do you want to delete the item? This action is irreversible.')) {
            performRequest(
              () => deleteProduct(props.product),
              props.onDelete
            )
          }
        }}
      >Delete</Button>
    </>
  )

}
