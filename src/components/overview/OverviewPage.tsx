import DateFnsUtils from '@date-io/date-fns';
import { createStyles, Grid, makeStyles, MenuItem, Paper, Select, TextField, Theme, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Field, Form, Formik, FormikErrors } from "formik";
import _ from 'lodash';
import React, { useContext, useState } from "react";
import AppContext, { Business } from "../../context/AppContext";
import SaveChangesSnackbar from "../common/SaveChangesSnackbar";
import Product from "../products/Product";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // TODO
        paperDiv: {
            padding: '20px'
        },
        paper: {
            padding: '20px',
            margin: '30px'
        },
        field: {
            width: '100%',
            marginTop: '20px',
            marginBottom: '20px'
        },
        mainTitle: {
            color: 'ghostwhite',
            marginBottom: '20px'
        },
        option: {

        },
        ul: {
            listStyle: "none",
            padding: 0
        },
        sectionTypography: {
            marginTop: '20px'
        }
    }));



export default function () {

    const classes = useStyles();

    const context = useContext(AppContext);

    const [saved, setSaved] = useState(true);

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    // If changed will update the state so the snackbar opens
    const validateAndSnackbar = (value: Business) => {
        const errors: FormikErrors<Product> = {};
        // TODO: validate
        if (!_.isEqual(value, context.business)) {
            setSaved(false);
            console.log(value, context.business)
        }
        return errors;
    }

    return (
        <div>
            <Typography
                className={classes.mainTitle}
                variant="h4"
                align="center"
            >Business Details</Typography>
            <Formik
                initialValues={context.business}
                validateOnBlur
                validate={validateAndSnackbar}
                onSubmit={(business, actions) => {
                    actions.setSubmitting(true)

                }}
            >
                {({ submitForm, isSubmitting, handleChange }) => (
                    <div>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" align="center">
                                Public Information
                            </Typography>
                            <Form>
                                <TextField
                                    className={classes.field}
                                    name="public.name"
                                    type="text"
                                    label="Business Name"
                                    placeholder="My Business"
                                />
                                <TextField
                                    className={classes.field}
                                    name="public.description"
                                    type="text"
                                    label="Description"
                                    placeholder="A short user-friendly description of your business"
                                />
                                <TextField
                                    className={classes.field}
                                    name="public.address"
                                    type="text"
                                    label="Public Address"
                                />

                                <TextField
                                    className={classes.field}
                                    name="public.website"
                                    type="text"
                                    label="Website (if any)"
                                />

                                <SaveChangesSnackbar
                                    open={!saved}
                                    buttonDisabled={isSubmitting}
                                    onSave={submitForm}
                                />
                            </Form>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" align="center">Other Details</Typography>
                            <Form>
                                <TextField
                                    className={classes.field}
                                    name="email"
                                    type="text"
                                    label="Private Email"
                                    placeholder="example@email.com"
                                />
                            </Form>
                        </Paper>
                    </div>
                )}
            </Formik>
        </div >
    )
}


interface WeekDaySelectProps {
    key?: string,
    defaultValue: string,
    handleChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
}

function WeekDaySelect({ key, defaultValue, handleChange }: WeekDaySelectProps) {

    const classes = useStyles();

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    key = key || defaultValue;

    return (
        < Field
            className={classes.field}
            component={Select}
            type="text"
            name={key}
            defaultValue={defaultValue}
            onChange={(event: any) => {
                handleChange(key)(event)
            }}
        >
            {weekDays.map(day => {
                return (
                    <MenuItem className={classes.option} key={day} value={day}>
                        {day}
                    </MenuItem>
                )
            })}
        </Field>
    )
}