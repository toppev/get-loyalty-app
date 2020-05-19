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
import { loginRequest } from '../../services/authenticationService';
import { validateEmail } from "../common/Validate";

interface FormValues {
    email: string,
    password: string
}

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

interface LoginFormProps {
    headerErrorMessage?: string
}

export default function LoginForm({ headerErrorMessage }: LoginFormProps) {

    const classes = useStyles();
    const context = useContext(AppContext);

    const initialValues = { email: "", password: "" }
    const [passwordResetOpen, setPasswordResetOpen] = useState(false);
    const [email, setEmail] = useState(initialValues.email);

    const onSubmit = (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
        loginRequest(values)
            .then(res => context.setUser(res.data))
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
        if(!validateEmail(values.email)) {
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
                    onSubmit={onSubmit}
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
