import { Button, createStyles, LinearProgress, Paper, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikErrors } from "formik";
import { TextField } from "formik-material-ui";
import RetryButton from "../common/button/RetryButton";
import SaveIcon from "@material-ui/icons/Save";
import React from "react";
import { PushNotification } from "./PushNotification";
import useRequest from "../../hooks/useRequest";
import { sendPushNotification } from "../../services/pushNotificationService";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            textAlign: 'center',
            padding: '15px',
            height: '400px'
        },
        form: {
            padding: '20px',
            width: '100%',
            marginTop: theme.spacing(1),
        },
        field: {
            width: '100%',
            margin: '12px 0px'
        },
        submitDiv: {
            paddingTop: '20px'
        },
        submitButton: {},

    }));

interface NotificationFormProps {
    notification: PushNotification
    onSubmitted?: (notification: PushNotification) => any
}

export default function ({ notification, onSubmitted }: NotificationFormProps) {

    const classes = useStyles();

    const { loading, error, performRequest } = useRequest();

    return (
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h5">Notification</Typography>
            <Formik
                initialValues={notification}
                validate={validate}
                onSubmit={(notification, actions) => {
                    if (window.confirm('Are you sure you want to send this notification to all customers that can receive notifications?')) {
                        performRequest(
                            () => sendPushNotification(notification),
                            () => {
                                actions.setSubmitting(false)
                                if (onSubmitted) {
                                    onSubmitted(notification);
                                }
                            },
                            () => actions.setSubmitting(false)
                        )
                    }
                }}
            >{({ submitForm, isSubmitting }) => (
                <Form className={classes.form}>
                    <TextField
                        className={classes.field}
                        name="title"
                        type="text"
                        label="Title"
                        placeholder="It's pizza friday!"
                    />
                    <TextField
                        className={classes.field}
                        name="message"
                        type="text"
                        label="Message"
                        placeholder="Get your pizza from us."
                    />
                    <TextField
                        className={classes.field}
                        name="link"
                        type="text"
                        label="Link (optional)"
                        placeholder="Your website url or link to anything else (e.g social media) or just empty :)"
                    />
                    {loading && <LinearProgress/>}
                    {error && <RetryButton error={error}/>}
                    <div className={classes.submitDiv}>
                        <Button
                            className={classes.submitButton}
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            startIcon={(<SaveIcon/>)}
                            onClick={submitForm}
                        >Send Notification</Button>
                    </div>
                </Form>
            )}
            </Formik>
        </Paper>
    )
}

function validate(values: PushNotification) {
    const errors: FormikErrors<PushNotification> = {};
    if (!values.title.trim().length) {
        errors.title = 'Title can not be empty'
    }
    if (!values.message.trim().length) {
        errors.message = 'Message can not be empty'
    }
    return errors;
}