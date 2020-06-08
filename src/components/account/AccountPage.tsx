import {
    Box,
    Button,
    createStyles,
    LinearProgress,
    makeStyles,
    Paper,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import LockIcon from '@material-ui/icons/Lock';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import clsx from 'clsx';
import { Form, Formik, FormikErrors } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext, useState } from "react";
import AppContext, { User } from "../../context/AppContext";
import { isEmail } from "../../util/Validate";
import { updateUser } from "../../services/userService";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: '25px',
            margin: '20px',
            flex: '1 1 0px'
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
        },
        progressErrorDiv: {
            margin: '20px 10px'
        }
    }));

export default function () {

    const { user } = useContext(AppContext);

    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div>

            <Box display="flex" flexDirection={bigScreen ? "row" : "column"}>
                <EmailForm
                    user={user}
                />

                <ResetPassword
                    user={user}
                    title={user.hasPassword ? "Reset Password" : "Set Password"}
                    highlight={!user.hasPassword}
                />
            </Box>
        </div>
    )
}

function handleUpdate(userId: string, value: any, setSubmitting: (state: boolean) => any, setError: (err: string) => any, callback?: () => any) {
    setSubmitting(true)
    setError("");
    updateUser(userId, value)
        .then(callback)
        .catch(err => {
            setError(`${err?.response?.data?.message || err?.response?.data || err.toString()}`);
        })
        .finally(() => {
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

    const context = useContext(AppContext);

    type EmailValues = { email: string };

    const validate = ({ email }: EmailValues) => {
        const errors: FormikErrors<User> = {};
        if (!isEmail(email)) {
            errors.email = "That doesn't look like an email address.";
        }
        setCanSubmit(!errors.email);
        return errors;
    }

    const initials: EmailValues = { email: user.email };

    return (
        <Formik
            initialValues={initials}
            validateOnBlur
            validate={validate}
            onSubmit={(value, actions) => {
                handleUpdate(user._id, value, actions.setSubmitting, setError,
                    () => context.setUser({
                        ...user, ...value
                    }))
            }}
        >
            {({ submitForm, isSubmitting, handleChange }) => (
                <Paper className={!user.email ? clsx(classes.paper, classes.highlight) : classes.paper}>
                    <Form>
                        <TextField
                            className={classes.field}
                            name="email"
                            type="text"
                            label="Account Email"
                            placeholder="example@email.com"
                        />
                        <div className={classes.progressErrorDiv}>
                            {isSubmitting && <LinearProgress/>}
                            {error && <Typography align="center" color="error">{error}</Typography>}
                        </div>
                        <Button
                            disabled={isSubmitting || !canSubmit}
                            onClick={submitForm}
                            variant="contained"
                            color="primary"
                            startIcon={<MailOutlineIcon/>}
                        >Update email</Button>
                    </Form>
                </Paper>
            )}
        </Formik>
    );
}

interface ResetPasswordProps {
    user: User
    title: string
    highlight: boolean
}

interface PasswordReset {
    password: string,
    repeatPassword: string
}


function ResetPassword({ user, title, highlight }: ResetPasswordProps) {

    const validate = (value: PasswordReset) => {
        const errors: FormikErrors<PasswordReset> = {};
        if (value.password && value.password.length <= 6) {
            errors.password = "Password is too weak!"
        } else if (value.repeatPassword && value.repeatPassword !== value.password) {
            errors.repeatPassword = "Passwords do not match!"
        }
        setCanSubmit(!!value.password && !!value.repeatPassword && !errors.password && !errors.repeatPassword);
        return errors;
    }

    const [canSubmit, setCanSubmit] = useState(false);
    const [error, setError] = useState("");

    const classes = useStyles();
    const context = useContext(AppContext);

    return (

        <Formik
            initialValues={{ password: "", repeatPassword: "" }}
            validate={validate}
            onSubmit={(value, actions) => {
                handleUpdate(user._id, { password: value.password }, actions.setSubmitting, setError, () => {
                    context.setUser({ ...user, hasPassword: true })
                })
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
                            label="New Password"
                        />
                        <TextField
                            className={classes.field}
                            name="repeatPassword"
                            type="password"
                            label="Repeat Password"
                        />
                        <Button
                            className={classes.passwordBtn}
                            disabled={isSubmitting || !canSubmit}
                            onClick={submitForm}
                            startIcon={(<LockIcon/>)}
                            variant="contained"
                        >{title}</Button>
                    </Form>
                    {error && <Typography align="center" color="error">{error}</Typography>}
                    {isSubmitting && <LinearProgress/>}
                </Paper>
            )}
        </Formik>
    )

}
