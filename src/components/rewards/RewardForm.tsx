import { Button, createStyles, LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import { Form, Formik, FormikErrors } from "formik";
import React, { useState } from "react";
import CategorySelector from '../categories/CategorySelector';
import IdText from "../common/IdText";
import ProductSelector from "../products/ProductSelector";
import Reward from "./Reward";
import { TextField } from "formik-material-ui";
import SelectProductsButton from "../products/button/SelectProductsButton";

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
        typography: {
            marginTop: '30px',
            fontSize: '14px',
            color: theme.palette.grey[600]
        }
    }));

const getEmptyReward = () => new Reward({
    id: `new_reward_${Math.random() * 1000 | 0}`,
    name: "",
    description: "",
    itemDiscount: ""
});

export interface RewardFormProps {
    initialReward?: Reward,
    onSubmitted: (reward: Reward) => void
}

export default function (props: RewardFormProps) {

    const classes = useStyles();

    const reward: Reward = props.initialReward || getEmptyReward();
    // not formik fields so keep track of them here
    const [categories, setCategories] = useState(reward.categories);
    const [products, setProducts] = useState(reward.products);

    const [productSelectorOpen, setProductSelectorOpen] = useState(false);

    const title = props.initialReward ? 'Edit Reward' : 'Create Reward';

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">{title}</Typography>
            <Formik
                initialValues={reward}
                validate={validate}
                onSubmit={(reward, actions) => {
                    // Update categories here
                    reward.categories = categories;
                    actions.setSubmitting(false)
                    props.onSubmitted(reward)
                }}
            >{({ submitForm, isSubmitting }) => (
                <Form className={classes.form}>

                    <TextField
                        className={classes.field}
                        name="name"
                        type="text"
                        label="Name"
                        placeholder="Cheap and good drinks!"
                    />
                    <TextField
                        className={classes.field}
                        name="description"
                        type="text"
                        label="Description"
                        placeholder="A softdrink with 50% discount!"
                    />
                    <TextField
                        className={classes.field}
                        name="itemDiscount"
                        type="text"
                        label="Discount"
                        placeholder="e.g 50% OFF, Free or Only 3€"
                    />
                    <TextField
                        className={classes.field}
                        name="requirement"
                        type="text"
                        label="Description"
                        placeholder='e.g "If total purchase is more than 10€\" or leave empty'
                    />

                    <TextField
                        className={classes.field}
                        name="customerPoints"
                        type="number"
                        label="Customer Points"
                        placeholder="Customer points to receive"
                    />


                    <p className={classes.typography}>
                        (Optional) Select which categories or products are included in the discount
                    </p>
                    <CategorySelector
                        className={classes.field}
                        initialCategories={reward.categories}
                        onCategoriesUpdate={setCategories}
                    />
                    <SelectProductsButton
                        products={products}
                        buttonProps={{
                            disabled: isSubmitting,
                            onClick: () => setProductSelectorOpen(true)
                        }}
                    />

                    <ProductSelector
                        open={productSelectorOpen}
                        onClickClose={() => setProductSelectorOpen(false)}
                        onSubmit={products => {
                            setProducts(products)
                            setProductSelectorOpen(false)
                        }}
                        text="Select products eligible for the discount"
                    />

                    {isSubmitting && <LinearProgress/>}
                    <br/>
                    <div className={classes.submitDiv}>
                        <Button className={classes.submitButton}
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                startIcon={(<SaveIcon/>)}
                                onClick={submitForm}>Save</Button>
                    </div>

                    <IdText id={reward.id}/>
                </Form>
            )}
            </Formik>
        </div>
    )
}

function validate(values: Reward): FormikErrors<Reward> {
    const errors: FormikErrors<Reward> = {};
    if (!values.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!values.itemDiscount.trim()) {
        errors.itemDiscount = 'Discount must be specified';
    }
    // TODO
    return errors;
}