import {
    Avatar,
    Button,
    Container,
    createStyles,
    LinearProgress,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, FormikErrors } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useContext, useState } from 'react';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PasswordResetRequestDialog from "./PasswordResetRequestDialog";
import AppContext from "../../context/AppContext";
import { loginRequest, onLoginOrAccountCreate } from '../../services/authenticationService';
import { isEmail } from "../../util/Validate";
import usePasswordReset from "./usePasswordReset";
import { AxiosResponse } from "axios";

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
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        field: {
            width: '100%',
            margin: '12px'
        },
        submitDiv: {
            textAlign: 'center',
        },
        submitButton: {
            margin: theme.spacing(3, 0, 2),
        },
    }));

interface FormValues {
    email: string,
    password: string
}

interface LoginFormProps {
    headerErrorMessage?: string
    onLogin?: () => any
}

export default function LoginForm({ headerErrorMessage, onLogin }: LoginFormProps) {

    const classes = useStyles();
    const context = useContext(AppContext);

    const initialValues = { email: "", password: "" }
    const [passwordResetOpen, setPasswordResetOpen] = useState(false);
    const [email, setEmail] = useState(initialValues.email);

    const _login = (res: AxiosResponse) => {
        onLoginOrAccountCreate(context, res);
        if (onLogin) {
            onLogin();
        }
    }

    // if passwordReset is in the url (search params) this will try to reset the password (will automatically login)
    usePasswordReset(_login) // TODO: use the error callback?

    const onFormSubmit = (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
        loginRequest(values)
            .then(_login)
            .catch(err => {
                if (err.response) {
                    const { status, data } = err.response
                    setErrors({ password: `An error occurred. ${data.message || `Status code: ${status}`}` })
                }
                setErrors({ password: `An error occurred. Please try again. ${err}` })
            })
            .finally(() => setSubmitting(false))
    }

    const validate = (values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        setEmail(values.email);
        if (!isEmail(values.email)) {
            errors.email = 'Invalid email address :/';
        }
        if (values.password.length <= 6) {
            errors.password = "That doesn't look like a strong password";
        }
        return errors;
    }

    return passwordResetOpen ? (
        <PasswordResetRequestDialog
            open
            initialEmail={email}
            onClose={() => setPasswordResetOpen(false)}
        />
    ) : (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">Login</Typography>
                <Typography variant="h4" color="secondary">{headerErrorMessage}</Typography>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onFormSubmit}
                    validate={validate}
                >
                    {props => {
                        const { isSubmitting, submitForm, handleSubmit } = props;
                        return (
                            <>
                                <form className={classes.form} onSubmit={handleSubmit}>
                                    <TextField
                                        className={classes.field}
                                        name="email"
                                        type="email"
                                        placeholder="example@email.com"
                                    />
                                    <TextField
                                        className={classes.field}
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                    />
                                    {isSubmitting && <LinearProgress/>}
                                    <br/>
                                    <div className={classes.submitDiv}>
                                        <Button
                                            className={classes.submitButton}
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            startIcon={<NavigateNextIcon/>}
                                            onClick={submitForm}
                                        >Login</Button>
                                    </div>
                                </form>
                                <Button
                                    disabled={isSubmitting}
                                    onClick={() => setPasswordResetOpen(true)}
                                >Forgot password?</Button>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Container>
    )
}
