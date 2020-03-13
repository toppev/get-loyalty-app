import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import { Formik, FormikErrors, Form } from "formik";
import _ from "lodash";
import React, { useContext, useState } from "react";
import AppContext, { User } from "../../context/AppContext";
import SaveChangesSnackbar from "../common/SaveChangesSnackbar";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: '40px'
        },
        field: {

        }
    }));

export default function () {

    const classes = useStyles();

    const context = useContext(AppContext);

    const [saved, setSaved] = useState(true);

    const validateAndSnackbar = (value: User) => {
        console.log("asd")
        const errors: FormikErrors<User> = {};
        // TODO: validate
        if (!_.isEqual(value, context.user)) {
            setSaved(false);
            console.log(value, context.user)
        }
        return errors;
    }

    return (
        <div>

            <Formik
                initialValues={context.user}
                validateOnBlur
                validate={validateAndSnackbar}
                onSubmit={(user, actions) => {
                    actions.setSubmitting(true)

                }}
            >
                {({ submitForm, isSubmitting, handleChange }) => (

                    <Paper className={classes.paper}>
                        <Form>
                            <TextField
                                className={classes.field}
                                name="email"
                                type="text"
                                label="Account Email"
                                placeholder="example@email.com"
                            />

                            <SaveChangesSnackbar
                                open={!saved}
                                buttonDisabled={isSubmitting}
                                onSave={submitForm}
                            />
                        </Form>
                    </Paper>
                )}
            </Formik>
        </div>
    );
}