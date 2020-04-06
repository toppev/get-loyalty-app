import { Button, createStyles, LinearProgress, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import LockIcon from '@material-ui/icons/Lock';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import clsx from 'clsx';
import { Form, Formik, FormikErrors } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext, useState } from "react";
import { patch } from "../../config/axios";
import AppContext, { User } from "../../context/AppContext";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: '20px',
            margin: '30px'
        },
        field: {
            width: '100%',
            marginTop: '20px',
            marginBottom: '20px'
        },
        highlight: {
            border: '1px solid red',
            boxShadow: '0px 0px 8px 2px red'
        },
        passwordBtn: {
            backgroundColor: theme.palette.success.light,
        }
    }));

export default function () {

    const { user } = useContext(AppContext);

    return (
        <div>
            <EmailForm
                user={user}
            />

            <ResetPassword
                user={user}
                title={user.hasPassword ? "Reset Password" : "Set Password"}
                highlight={!user.hasPassword}
            />
        </div>
    )
}

function updateUser(userId: string, value: object, setSubmitting: (state: boolean) => any, setError: (err: string) => any) {
    setSubmitting(true)
    setError("");
    patch(`/user/${userId}`, value)
        .then(res => {
            if(res.status !== 200) {
                if(res.data.message) {
                    // FIXME: better message?
                    setError(res.data.message);
                }
            }

        }).catch(err => {
            setError(`${err}. Please try again.`);
        }).finally(() => {
            setSubmitting(false);
        });
}

interface EmailFormProps {
    user: User
}

function EmailForm({ user }: EmailFormProps) {

    const classes = useStyles();

    const [error, setError] = useState("");
    const [canSubmit, setCanSubmit] = useState(false);

    const validate = ({ email }: User) => {
        const errors: FormikErrors<User> = {};
        if (!validateEmail(email)) {
            errors.email = "That doesn't look like an email address.";
        }
        setCanSubmit(!!!errors.email);
        return errors;
    }

    return (
        <Formik
            initialValues={user}
            validateOnBlur
            validate={validate}
            onSubmit={(value, actions) => updateUser(value._id, value, actions.setSubmitting, setError)}
        >
            {({ submitForm, isSubmitting, handleChange }) => (
                <Paper className={!!!user.email ? clsx(classes.paper, classes.highlight) : classes.paper}>
                    <Form>
                        <TextField
                            className={classes.field}
                            name="email"
                            type="text"
                            label="Account Email"
                            placeholder="example@email.com"
                        />

                        <Button
                            disabled={isSubmitting || !canSubmit}
                            onClick={submitForm}
                            variant="contained"
                            color="primary"
                            startIcon={<MailOutlineIcon />}
                        >Update email</Button>

                    </Form>
                    {error && <Typography align="center" color="error">{error}</Typography>}
                    {isSubmitting && <LinearProgress />}
                </Paper>
            )}
        </Formik>
    );
}

function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}




interface ResetPasswordProps {
    user: User
    title: string
    highlight: boolean
}

function ResetPassword({ user, title, highlight }: ResetPasswordProps) {

    interface PasswordReset {
        password: string,
        repeatPassword: string
    }

    const validate = (value: PasswordReset) => {
        const errors: FormikErrors<PasswordReset> = {};
        if (value.password && value.password.length <= 6) {
            errors.password = "Password is too weak!"
        }
        else if (value.repeatPassword && value.repeatPassword !== value.password) {
            errors.repeatPassword = "Passwords do not match!"
        }
        setCanSubmit(!!value.password && !!value.repeatPassword
            && !!!errors.password && !!!errors.repeatPassword);
        return errors;
    }

    const [canSubmit, setCanSubmit] = useState(false);
    const [error, setError] = useState("");

    const classes = useStyles();

    return (

        <Formik
            initialValues={{ password: "", repeatPassword: "" }}
            validate={validate}
            onSubmit={(value, actions) => {
                updateUser(user._id, { password: value.password }, actions.setSubmitting, setError)
            }}
        >
            {({ submitForm, isSubmitting, handleChange }) => (
                <Paper className={highlight ? clsx(classes.paper, classes.highlight) : classes.paper}>

                    <Typography
                        variant="h6"
                        align="center">
                        {title}
                    </Typography>

                    <Form>
                        <TextField
                            className={classes.field}
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="mYpAsSwOrD123"
                        />

                        <TextField
                            className={classes.field}
                            name="repeatPassword"
                            type="password"
                            label="Repeat Password"
                            placeholder="mYpAsSwOrD123"
                        />

                        <Button
                            className={classes.passwordBtn}
                            disabled={isSubmitting || !canSubmit}
                            onClick={submitForm}
                            startIcon={(<LockIcon />)}
                            variant="contained"
                        >{title}</Button>
                    </Form>
                    {error && <Typography align="center" color="error">{error}</Typography>}
                    {isSubmitting && <LinearProgress />}
                </Paper>
            )}
        </Formik >
    )

}
