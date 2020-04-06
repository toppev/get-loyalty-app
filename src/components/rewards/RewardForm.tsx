import { Button, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SaveIcon from '@material-ui/icons/Save';
import { Form, Formik, FormikErrors } from "formik";
import React, { useState } from "react";
import CategoryChangeField from '../categories/CategorySelector';
import IdText from "../common/IdText";
import ProductSelector from "../products/ProductSelector";
import Reward from "./Reward";

export interface RewardFormProps {
    initialReward?: Reward,
    onSubmitted: (reward: Reward) => void
}


const emptyReward = new Reward(`new_reward_${Math.random() * 1000 | 0}`, "", "", "");

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
    }));


export default function (props: RewardFormProps) {

    const classes = useStyles();

    const reward: Reward = props.initialReward || emptyReward;
    // not formik fields so keep track of them here
    const [categories, setCategories] = useState(reward.categories);
    const [products, setProducts] = useState(reward.products);

    const [productSelectorOpen, setProductSelectorOpen] = useState(false);

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">reward</Typography>
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

                    <Typography variant="h6">(Optional) Select which categories or products are included in the discount</Typography>

                    <CategoryChangeField
                        className={classes.field}
                        initialCategories={reward.categories}
                        onCategoriesUpdate={setCategories}
                    />

                    <Button className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={(<FastfoodIcon />)}
                        onClick={() => setProductSelectorOpen(true)}>Select Products</Button>
                    <ProductSelector
                        open={productSelectorOpen}
                        onClickClose={() => setProductSelectorOpen(false)}
                        onSubmit={products => setProducts(products)}
                        text="Select products eligible for the discount"
                    />

                    {isSubmitting && <LinearProgress />}
                    <br />
                    <div className={classes.submitDiv}>
                        <Button className={classes.submitButton}
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            startIcon={(<SaveIcon />)}
                            onClick={submitForm}>Save</Button>
                    </div>

                    <IdText id={reward._id} />
                </Form>
            )}
            </Formik>
        </div >
    )
}

function validate(values: Reward): FormikErrors<Reward> {
    const errors: FormikErrors<Reward> = {};
    // TODO
    return errors;
}