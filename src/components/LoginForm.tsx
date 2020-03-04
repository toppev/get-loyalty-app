import { Avatar, Button, Container, createStyles, LinearProgress, Link, makeStyles, Theme, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Form, Formik, FormikErrors } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { post } from '../config/axios';

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


export function LoginForm() {

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Login</Typography>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validate={validate}
                    onSubmit={(values, { setSubmitting, setErrors }) => {
                        //TODO
                        console.log("Submitted Email:", values.email)
                        console.log("Submitted Password:", values.password)
                        setTimeout(() => {
                            setSubmitting(false)
                            setErrors({ password: 'Invalid password!' })
                        }, 3 * 1000)
                    }}
                >{({ submitForm, isSubmitting }) => (
                    <Form className={classes.form}>
                        <TextField className={classes.field} name="email" type="email" placeholder="example@email.com" />
                        <TextField className={classes.field} name="password" type="password" placeholder="password123" />
                        {isSubmitting && <LinearProgress />}
                        <br />
                        <div className={classes.submitDiv}>
                            <Button className={classes.submitButton}
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                onClick={submitForm}>Login</Button>
                        </div>
                    </Form>
                )}
                </Formik>
                <Link href="#" onClick={PasswordResetRequest} variant="body2">Forgot password?</Link>
            </div >
        </Container>
    )
}

export default LoginForm;

async function validate(values: FormValues) {
    const errors: FormikErrors<FormValues> = {};
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (values.password.length < 5) {
        errors.password = "Doesn't look like a password";
    }
    return errors;
};

async function PasswordResetRequest() {
    await post('/resetpassword', { email: 'asd' })
    // TODO dialog/message
}