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
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useContext, useState } from 'react';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';
import PasswordResetRequestDialog from "./PasswordResetRequestDialog";
import AppContext from "../../context/AppContext";
import { loginRequest, onLoginOrAccountCreate, registerRequest } from '../../services/authenticationService';
import { isEmail } from "../../util/Validate";
import usePasswordReset from "./usePasswordReset";
import { getOrCreateServer, waitForServer } from "../../services/serverService";
import { AxiosResponse } from 'axios';

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
        title: {
            marginBottom: '7px',
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            margin: '7px 0px',
        },
        field: {
            width: '100%',
            margin: '12px'
        },
        submitDiv: {
            textAlign: 'center',
        },
        submitButton: {
            margin: '15px 10px'
        },
    }));

interface FormValues {
    email: string,
    password: string
}

interface LoginFormProps {
    getCaptchaToken: () => string
}

const initialValues = { email: "", password: "" }

export default function LoginForm({ getCaptchaToken }: LoginFormProps) {

    const classes = useStyles();
    const context = useContext(AppContext);

    const [passwordResetOpen, setPasswordResetOpen] = useState(false);

    const [email, setEmail] = useState(initialValues.email);
    // Whether we are logging or creating a new account
    // Not really clean solution but does the job
    const [creatingAccount, setCreatingAccount] = useState(false);
    const [message, setMessage] = useState('');

    const onSuccess = (res: AxiosResponse<any>) => {
        try {
            onLoginOrAccountCreate(context, res);
        } catch (e) {
            console.log(e)
            setMessage(`Oops. Something went wrong. ${e}`)
        }
    }

    // if passwordReset is in the url (search params) this will try to reset the password (will automatically login)
    usePasswordReset(onSuccess) // TODO: use the error callback?

    const loginAccount = (values: FormValues, { setSubmitting, setErrors }: any) => {
        loginRequest({ ...values, token: getCaptchaToken() })
            .then(onSuccess)
            .catch(err => {
                if (err.response) {
                    const { status, data } = err.response
                    setErrors({ password: `An error occurred. ${data?.message || `Status code: ${status}`}` })
                }
                setErrors({ password: `An error occurred. Please try again. ${err}` })
            })
            .finally(() => {
                setMessage('')
                setSubmitting(false)
            });
    }

    const createAccount = (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
        registerRequest({ token: getCaptchaToken() })
            .then(onSuccess)
            .catch(err => {
                console.log("Error creating an account: " + err);
                setErrors({ password: `${err}. Please try again.` });
            })
            .finally(() => {
                setMessage('')
                setSubmitting(false)
            });
    }

    const onFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
        getOrCreateServer(values.email, creatingAccount)
            .then(() => {
                setMessage(creatingAccount ? "Creating a new server..." : "Waiting for the server...")
            })
            .catch((e) => {
                actions.setSubmitting(false)
                if (e.response?.status === 404) {
                    setMessage('No servers available. Please try again later.')
                } else {
                    setMessage(e?.response?.data?.message || e.toString())
                }
            })

        waitForServer(() => {
            setMessage("Logging in...")
            if (creatingAccount) {
                createAccount(values, actions)
            } else {
                loginAccount(values, actions)
            }
        })
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
                <Typography className={classes.title} variant="h6" color="primary">Login or create an
                    account</Typography>
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

                                    <Typography variant="h6" align="center">{message}</Typography>
                                    {isSubmitting && <LinearProgress/>}

                                    <br/>
                                    <div className={classes.submitDiv}>
                                        <Button
                                            className={classes.submitButton}
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            startIcon={<NavigateNextIcon/>}
                                            onClick={() => {
                                                setCreatingAccount(false)
                                                submitForm()
                                            }}
                                        >Login</Button>
                                        <Button
                                            className={classes.submitButton}
                                            variant="outlined"
                                            color="primary"
                                            disabled={isSubmitting}
                                            startIcon={<AddIcon/>}
                                            onClick={() => {
                                                setCreatingAccount(true)
                                                submitForm()
                                            }}
                                        >Register</Button>
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
