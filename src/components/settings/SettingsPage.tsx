import {
    Box,
    Button,
    createStyles,
    Dialog,
    DialogContent,
    LinearProgress,
    Paper,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikErrors } from "formik";
import AppContext, { Business } from "../../context/AppContext";
import _ from "lodash";
import { TextField } from "formik-material-ui";
import { updateBusiness } from "../../services/businessService";
import { Alert } from "@material-ui/lab";
import { API_URL } from "../../config/axios";
import useRequest from "../../hooks/useRequest";
import SaveChangesSnackbar from "../common/SaveChangesSnackbar";
import { getOrCreateServer, updateServer, waitForServer } from "../../services/serverService";
import RetryButton from "../common/button/RetryButton";
import { isURL } from "../../util/Validate";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        typography: {
            textAlign: 'center',
            color: theme.palette.grey[300],
            margin: '15px'
        },
        sectionTypography: {
            color: theme.palette.grey[800],
            marginBottom: '10px',
        },
        description: {
            textAlign: 'center',
            color: theme.palette.grey[600]
        },
        paper: {
            padding: '25px',
            margin: '20px',
            flex: '1 1 0px'
        },
        fieldDiv: {
            marginTop: '20px',
            marginBottom: '20px'
        },
        field: {
            width: '85%',
            margin: '8px 0px'
        },
        helpIcon: {
            marginLeft: '10px'
        },
        mainTitle: {
            color: 'ghostwhite',
            marginBottom: '20px'
        },
        option: {},
        ul: {
            listStyle: "none",
            padding: 0
        },
        updateButton: {
            marginTop: '5px'
        }
    }));

export default function () {

    const classes = useStyles();

    const context = useContext(AppContext);

    const [saved, setSaved] = useState(true);
    const [error, setError] = useState('');

    const theme = useTheme();
    const request = useRequest()

    const { business } = context;
    const { translations } = business.config;
    const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

    // If changed will update the state so the snackbar opens
    const validateAndSnackbar = (value: Business) => {
        const errors: FormikErrors<Business> = {};
        if (!_.isEqual(value, business)) {
            setSaved(false);
            console.log(value, business)
        }
        return errors;
    }

    return (
        <div>
            <Typography
                variant="h5"
                className={classes.typography}
            >Your loyalty app pages</Typography>
            {error.length > 0 && <Alert severity="error">{error}</Alert>}
            <Box display="flex" flexDirection={bigScreen ? "row" : "column"}>
                <Paper className={classes.paper}>
                    <Typography className={classes.sectionTypography} variant="h6" align="center">
                        Translations & Names
                    </Typography>
                    <p className={classes.description}
                    >You can translate messages and other things here.</p>
                    <Formik
                        initialValues={business}
                        validateOnBlur
                        validate={validateAndSnackbar}
                        onSubmit={(updatedBusiness, actions) => {
                            console.log('sending')
                            actions.setSubmitting(true)

                            request.performRequest(
                                () => updateBusiness(updatedBusiness),
                                (res) => {
                                    setSaved(true);
                                    context.setBusiness(res.data);
                                    actions.setSubmitting(false);
                                },
                                () => actions.setSubmitting(false)
                            );
                        }}
                    >
                        {({ submitForm, isSubmitting }) => (
                            <Form>
                                <div className={classes.fieldDiv}>
                                    {Object.keys(translations).map(k => {
                                            const { plural, singular, placeholder } = translations[k];
                                            const both = plural && singular;
                                            return (
                                                <div key={k}>
                                                    {plural && <TextField
                                                        className={classes.field}
                                                        name={`config.translations.${k}.plural`}
                                                        type="text"
                                                        label={`"${k}" translation ${both ? "(plural)" : ""}`}
                                                        placeholder={placeholder}
                                                    />}
                                                    {singular && <TextField
                                                        className={classes.field}
                                                        name={`config.translations.${k}.singular`}
                                                        type="text"
                                                        label={`"${k}" translation ${both ? "(singular)" : ""}`}
                                                        placeholder={placeholder}
                                                    />}
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                                <SaveChangesSnackbar
                                    open={!saved}
                                    buttonDisabled={isSubmitting}
                                    onSave={submitForm}
                                />
                            </Form>

                        )}
                    </Formik>
                </Paper>

                <Paper className={classes.paper}>
                    <ServerSettingsForm/>
                </Paper>
            </Box>
        </div>
    )
}

export type ServerSettings = { appAddress?: string, customApiAddress?: string }

function ServerSettingsForm() {
    const classes = useStyles();
    const context = useContext(AppContext)

    const updateRequest = useRequest();

    const serverInfo = useRequest(() => getOrCreateServer(context.user.email, false))

    const [restarting, setRestarting] = useState(false);

    const validate = (settings: ServerSettings) => {
        const errors: FormikErrors<ServerSettings> = {};
        if (settings.appAddress && !isURL(settings.appAddress)) {
            errors.appAddress = 'Invalid URL'
        }
        /*
        if (settings.customApiAddress && !isURL(settings.customApiAddress)) {
            errors.customApiAddress = 'Invalid URL'
        }
        */
        return errors;
    }

    useEffect(() => {
        if (restarting) {
            waitForServer(() => setRestarting(false))
        }
    }, [restarting]);

    const loading = serverInfo.loading || updateRequest.loading
    const error = serverInfo.error || updateRequest.error

    return (
        <div>
            <Typography className={classes.sectionTypography} variant="h6" align="center">Other</Typography>
            {loading && <LinearProgress/>}
            {error && <RetryButton error={error}/>}
            <Dialog open={restarting}>
                <DialogContent>
                    <Typography variant="h5" color="secondary">Your app is restarting...</Typography>
                    <p>This may take up to a few minutes.</p>
                    <LinearProgress/>
                </DialogContent>
            </Dialog>

            {!serverInfo.loading &&
            <Formik
                initialValues={serverInfo?.response?.data}
                validateOnBlur
                validate={validate}
                onSubmit={(values, actions) => {
                    if (window.confirm('This will restart the server and you will not be able to anything for a moment.')) {
                        actions.setSubmitting(true)
                        const appAddress = values?.appAddress?.trim()
                        if (appAddress && !appAddress.startsWith("https://") && !appAddress.startsWith("http://")) {
                            values.appAddress = `https://${values.appAddress}`
                        }
                        setRestarting(true)
                        updateRequest.performRequest(
                            () => updateServer(values),
                            (res) => {
                                actions.setSubmitting(false);
                            },
                            () => actions.setSubmitting(false)
                        );
                    }
                }}
            >
                {({ submitForm, isSubmitting }) => (
                    <Paper className={classes.paper}>
                        <Form>
                            Create a new A record to <b>"{API_URL.replace("https://", "")}"</b> and enter an address for
                            the loyalty app.
                            <TextField
                                className={classes.field}
                                placeholder="example.com/app or app.example.com"
                                name="appAddress"
                                type="text"
                                label="Loyalty App Address"
                            />
                            <div>
                                <Button
                                    className={classes.updateButton}
                                    disabled={isSubmitting}
                                    variant="contained"
                                    onClick={() => submitForm()}
                                >Update</Button>
                            </div>
                        </Form>
                    </Paper>
                )}
            </Formik>
            }
        </div>
    )
}