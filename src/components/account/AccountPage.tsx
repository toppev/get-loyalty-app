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
import useRequest from "../../hooks/useRequest";
import RetryButton from "../common/button/RetryButton";
import { updateServerOwner } from "../../services/serverService";

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

interface EmailFormProps {
    user: User
}

function EmailForm({ user }: EmailFormProps) {

    const classes = useStyles();

    const [canSubmit, setCanSubmit] = useState(false);

    const context = useContext(AppContext);

    type EmailValues = { email: string };

    const validate = ({ email }: EmailValues) => {
        const errors: FormikErrors<User> = {};
        if (!isEmail(email)) {
            errors.email = "That doesn't look like an email address.";
        }
        setCanSubmit(!errors.email && email !== user.email);
        return errors;
    }

    const initials: EmailValues = { email: user.email };

    const { error, performRequest, loading } = useRequest()

    return (
        <Formik
            initialValues={initials}
            validateOnBlur
            validate={validate}
            onSubmit={(value, actions) => {
                actions.setSubmitting(true)
                performRequest(async () => {
                    await updateServerOwner({ email: context.user.email, updated: { email: value.email } })
                    await updateUser(user._id, value)
                }, () => {
                    actions.setSubmitting(false)
                    context.setUser({
                        ...user, ...value
                    })
                })
            }}
        >
            {({ submitForm }) => (
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
                            {loading && <LinearProgress/>}
                            <RetryButton error={error}/>
                        </div>
                        <Button
                            disabled={loading || !canSubmit}
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

    const classes = useStyles();
    const context = useContext(AppContext);

    const { loading, error, performRequest } = useRequest()

    return (

        <Formik
            initialValues={{ password: "", repeatPassword: "" }}
            validate={validate}
            onSubmit={(values, actions) => {
                performRequest(
                    () => updateUser(user._id, { password: values.password }),
                    () => {
                        actions.setSubmitting(false)
                        context.setUser({
                            ...user, hasPassword: true
                        })
                    })
            }}
        >
            {({ submitForm }) => {
                return (
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
                                required
                            />
                            <TextField
                                className={classes.field}
                                name="repeatPassword"
                                type="password"
                                label="Repeat Password"
                                required
                            />
                            <Button
                                className={classes.passwordBtn}
                                disabled={loading || !canSubmit}
                                onClick={submitForm}
                                startIcon={(<LockIcon/>)}
                                variant="contained"
                            >{title}</Button>
                        </Form>
                        <RetryButton error={error}/>
                        {loading && <LinearProgress/>}
                    </Paper>
                );
            }}
        </Formik>
    )

}
