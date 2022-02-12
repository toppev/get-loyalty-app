import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, { useState } from 'react'
import RetryButton from '../common/button/RetryButton'
import ImportProducts from './importer/ImportProducts'
import Product from './Product'
import ProductFormDialog from './ProductFormDialog'
import ProductRow from './ProductRow'
import SearchField from "../common/SearchField"
import NewButton from "../common/button/NewButton"
import { listProducts } from "../../services/productService"
import useRequest from "../../hooks/useRequest"
import useResponseState from "../../hooks/useResponseState"
import useSearch from "../../hooks/useSearch"
import Tip from "../common/Tip"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {},
    productList: {
      paddingLeft: 0,
    },
    tools: {
      marginBottom: '25px',
    },
    newBtn: {
      marginRight: '15px'
    },
    importBtn: {
      backgroundColor: theme.palette.grey[400],
    },
    info: {
      fontSize: '14px',
      color: theme.palette.grey[300],
      marginBottom: '40px'
    },
    noProducts: {
      color: theme.palette.grey[600],
    },
    head: {
      backgroundColor: '#c9d2d4'
    },
  }))

export default function ProductPage() {

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  const { setSearch, searchFilter } = useSearch()

  const { error: errorListing, loading: listing, response, execute: reloadProducts } = useRequest(listProducts)
  const [products, setProducts] = useResponseState<Product[]>(response, [], res => res.data.map((it: any) => new Product(it)))
  const otherRequest = useRequest()

  const classes = useStyles()
  const error = errorListing || otherRequest.error
  const loading = listing || otherRequest.loading

  const filteredProducts = products.filter(searchFilter)

  return (
    <div>
      {error ? (
        <RetryButton error={error}/>
      ) : (
        <div className={classes.paper}>

          <div className={classes.info}>
            <p>Create or import existing products from a .csv file here.</p>
            <Tip>
              You don't have to create all products (or none at all!).
              You can also just create generic products that you need in your campaigns/rewards, for example "Pizza", "Vegan burgers" or "Men's haircut".
            </Tip>
          </div>

          <Box display="flex" className={classes.tools}>
            <NewButton
              name="New Product"
              buttonProps={{
                className: classes.newBtn,
                onClick: () => setFormOpen(true)
              }}
            />
            <ImportProducts className={classes.importBtn} variant="contained"/>
          </Box>

          <SearchField
            setSearch={setSearch}
            name={"product_search"}
            placeholder={"Search products..."}
          />

          {loading && <LinearProgress/>}

          <TableContainer>
            <Table>
              <TableHead className={classes.head}>
                <TableRow>
                  <TableCell>Show/Hide</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Categories</TableCell>
                  <TableCell/>
                  <TableCell/>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map(product => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    startEditing={product => setEditingProduct(product)}
                    onDelete={() => setProducts(products.filter(p => p.id !== product.id))}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <p className={classes.noProducts}>
            {filteredProducts.length === 0 && (products.length === 0
              ? "You don't have any products"
              : "No products found"
            )}
          </p>

          <ProductFormDialog
            open={formOpen || !!editingProduct}
            initialProduct={editingProduct}
            onClose={() => {
              setFormOpen(false)
              setEditingProduct(undefined)
            }}
            onProductSubmitted={() => {
              reloadProducts()
              setFormOpen(false)
              setEditingProduct(undefined)
            }}/>

        </div>
      )}
    </div>
  )
}
