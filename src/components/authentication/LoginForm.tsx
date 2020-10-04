import {
    Avatar,
    Button,
    Container,
    createStyles,
    FormControlLabel,
    LinearProgress,
    Link,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import { Checkbox, TextField } from 'formik-material-ui';
import React, { useContext, useRef, useState } from 'react';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';
import PasswordResetRequestDialog from "./PasswordResetRequestDialog";
import AppContext from "../../context/AppContext";
import { loginRequest, onLoginOrAccountCreate, registerRequest } from '../../services/authenticationService';
import usePasswordReset from "./usePasswordReset";
import { getOrCreateServer } from "../../services/serverService";
import { AxiosResponse } from 'axios';
import { isEmail } from "../../util/Validate";
import ReCAPTCHA from 'react-google-recaptcha';
import { privacyLink, termsLink } from "../Navigator";

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
        forgotPasswordDiv: {
            width: '100%',
            textAlign: 'end'
        },
        forgotPasswordButton: {
            left: '38px'
        },
        message: {
            marginTop: '5px',
            fontSize: '14px',
            color: theme.palette.grey[700]
        },
    }));

interface FormValues {
    email: string,
    password: string
    token: string
    acceptAll: boolean
}

const initialValues: FormValues = { email: "", password: "", token: "", acceptAll: false }

export default function LoginForm() {

    const classes = useStyles();
    const context = useContext(AppContext);

    const recaptchaRef = useRef(null);

    const getCaptchaToken = (): Promise<string> => {
        // @ts-ignore
        recaptchaRef.current.reset()
        // @ts-ignore
        return recaptchaRef.current.executeAsync()
    }

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

    const loginAccount = async (values: FormValues, { setSubmitting, setErrors }: any) => {
        setMessage("Logging in...")
        loginRequest(values)
            .then(onSuccess)
            .catch(err => {
                setErrors({ password: `${err?.response?.data?.message || err}` })
            })
            .finally(() => {
                setMessage('')
                setSubmitting(false)
            });
    }

    const createAccount = async (values: FormValues, { setSubmitting, setErrors }: any) => {
        setMessage("Creating account...")
        registerRequest(values)
            .then(onSuccess)
            .catch(err => {
                console.log("Error creating an account: " + err);
                setErrors({ password: `${err?.response?.data?.message || err}. Please try again.` });
            })
            .finally(() => {
                setMessage('')
                setSubmitting(false)
            });
    }

    const onFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
        setMessage("Verifying...")
        getCaptchaToken().then(token => {
            setMessage("Connecting...")
            const { email } = values
            getOrCreateServer({ email, token }, creatingAccount)
                .then(async () => {
                    // We need a new token for "loyalty-backend" as first one was used by the "loyalty-servers"
                    // Kinda hacky
                    values.token = await getCaptchaToken()
                    if (creatingAccount) {
                        createAccount(values, actions).then()
                    } else {
                        loginAccount(values, actions).then()
                    }
                })
                .catch((e) => {
                    actions.setSubmitting(false)
                    if (e.response?.status === 404) {
                        if (creatingAccount) {
                            setMessage('No servers available. Please try again later.')
                        } else {
                            setMessage('Account not found. Did you mean to register?')
                        }
                    } else {
                        setMessage(e?.response?.data?.message || `Error code: ${e?.response?.status}` || e.toString())
                    }
                })
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
                <Typography className={classes.title} align="center" variant="h6" color="primary"
                >Login or create an account</Typography>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onFormSubmit}
                    validate={validate}
                >
                    {props => {
                        const { isSubmitting, submitForm, handleSubmit, values } = props;
                        return (
                            <>
                                <form className={classes.form} onSubmit={handleSubmit}>
                                    <TextField
                                        autoFocus
                                        className={classes.field}
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        label="Email address"
                                        placeholder="example@email.com"
                                        required
                                    />
                                    <TextField
                                        className={classes.field}
                                        name="password"
                                        type="password"
                                        label="Password"
                                        autoComplete="password"
                                        required
                                    />

                                    <div style={{ textAlign: 'center' }}>
                                        <FormControlLabel
                                            control={<Checkbox name="acceptAll" size="small"/>}
                                            label={<p style={{ fontSize: '12px' }}>
                                                Accept
                                                <Link
                                                    href={privacyLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                > terms of service </Link>
                                                and
                                                <Link
                                                    href={termsLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                > privacy policy</Link>.
                                            </p>}
                                        />
                                    </div>

                                    <Typography variant="h6" align="center"
                                                className={classes.message}>{message}</Typography>
                                    {isSubmitting && <LinearProgress/>}

                                    <br/>
                                    <div className={classes.submitDiv}>
                                        <Button
                                            type="submit"
                                            className={classes.submitButton}
                                            variant={values.acceptAll ? "outlined" : "contained"}
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
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting || !values.acceptAll}
                                            startIcon={<AddIcon/>}
                                            onClick={() => {
                                                setCreatingAccount(true)
                                                submitForm()
                                            }}
                                        >Register</Button>
                                    </div>

                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        size="invisible"
                                        sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY!!}
                                    />
                                </form>
                                <div
                                    className={classes.forgotPasswordDiv}>
                                    <Button
                                        className={classes.forgotPasswordButton}
                                        color="primary"
                                        size="small"
                                        disabled={isSubmitting}
                                        onClick={() => setPasswordResetOpen(true)}
                                    >Forgot password?</Button>
                                </div>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Container>
    )
}
