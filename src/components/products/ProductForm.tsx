import { Button, createStyles, LinearProgress, makeStyles, Theme, Typography } from '@material-ui/core';
import { Form, Formik, FormikErrors } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { post } from '../../config/axios';
import CategoryChangeField from './CategoryChangeField';
import Product from './Product';

export interface ProductFormProps {
    initialProduct?: Product,
    onProductSubmitted: (product: Product) => void
}


const emptyProduct = { _id: Math.random().toString(), name: "", description: "", price: "", categories: [] };

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        field: {
            width: '100%',
            margin: '12px 0px'
        },
        submitDiv: {
            textAlign: 'center',
        },
        submitButton: {
            margin: theme.spacing(3, 0, 2),
        },
        itemId: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
            color: 'rgba(0, 0, 0, 0.5)',
            fontSize: '0.6em',
            margin: '3px 0px 0px 0px',
            textAlign: 'center',
        },
    }));


export default function (props: ProductFormProps) {

    const classes = useStyles();

    const product = props.initialProduct || emptyProduct
    // CategoryChangeField is not formik field so keep track of categories here
    const [categories, setCategories] = useState(product.categories);

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">Product</Typography>
            <Formik
                initialValues={product}
                validate={validate}
                onSubmit={(product, actions) => {
                    // Update categories here
                    product.categories = categories;
                    actions.setSubmitting(false)
                    props.onProductSubmitted(product)
                }}
            >{({ submitForm, isSubmitting }) => (
                <Form className={classes.form}>

                    <TextField className={classes.field} name="name" type="text" label="Name" placeholder="Pizza" />
                    <TextField className={classes.field} name="description" type="text" label="Description" placeholder="A delicious pineapple pizza!" />
                    <TextField className={classes.field} name="price" type="text" label="Price" placeholder="10€ take it or leave it" />

                    <CategoryChangeField className={classes.field}
                        initialCategories={product.categories}
                        onCategoriesUpdate={setCategories}
                    />

                    {isSubmitting && <LinearProgress />}
                    <br />
                    <div className={classes.submitDiv}>
                        <Button className={classes.submitButton}
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            onClick={submitForm}>Save</Button>
                    </div>
                    
                    <p className={classes.itemId}>ID: {product._id}</p>
                </Form>
            )}
            </Formik>
        </div>
    )
}

function validate(values: Product) {
    const errors: FormikErrors<Product> = {};
    // TODO
    return errors;
}