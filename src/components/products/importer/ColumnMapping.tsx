import { Button, createStyles, Grid, LinearProgress, makeStyles, MenuItem, Theme, Typography, Select } from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";

interface Props {
    open: boolean,
    initialFields: KeyValue,
    options: string[]
    onSubmit: (mappings: KeyValue, actions: FormikHelpers<KeyValue>) => void
}

export interface KeyValue {
    [key: string]: string | null;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        submitButton: {
            margin: '20px'
        },
        content: {
            marginTop: '35px',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
        row: {
            marginTop: '20px'
        },
        option: {

        }
    }));

export default function (props: Props) {

    const [mapping, setMapping] = useState(props.initialFields)

    const classes = useStyles();

    return props.open ? (
        <div className={classes.content}>
            <Typography variant="h5">Column Mapping</Typography>
            <Formik
                initialValues={props.initialFields}
                onSubmit={props.onSubmit}
            >{({ submitForm, isSubmitting, handleChange }) => (
                <Form>
                    {Object.keys(props.initialFields).map(key => {
                        const value = props.initialFields[key];
                        return (
                            <Grid
                                className={classes.row}
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                                key={key}
                            >
                                <Grid item xs={4} sm={4}>
                                    <Typography align="left">{key}</Typography>
                                </Grid>
                                <Grid item xs={4} sm={4}>
                                    < Field
                                        component={Select}
                                        type="text"
                                        name={key}
                                        defaultValue={value}
                                        onChange={(event: any) => {
                                            handleChange(key)(event)
                                        }}
                                    >
                                        {props.options.map(option => {
                                            return (
                                                <MenuItem className={classes.option} key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            )
                                        })}
                                    </Field>
                                </Grid>
                            </Grid>
                        )
                    })}
                    <Button
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}>Preview Products</Button>
                    
                    {isSubmitting && <LinearProgress/>}

                </Form>
            )}
            </Formik>
        </div >
    ) : null;

}