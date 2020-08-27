import {
    Box,
    Button,
    createStyles,
    Dialog,
    DialogContent,
    FormHelperText,
    Input,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikErrors } from "formik";
import AppContext, { Business } from "../../context/AppContext";
import _ from "lodash";
import { TextField } from "formik-material-ui";
import { updateBusiness } from "../../services/businessService";
import { Alert } from "@material-ui/lab";
import { backendURL } from "../../config/axios";
import useRequest from "../../hooks/useRequest";
import SaveChangesSnackbar from "../common/SaveChangesSnackbar";
import { getOrCreateServer, updateServer, waitForServer } from "../../services/serverService";
import RetryButton from "../common/button/RetryButton";
import { isURL } from "../../util/Validate";
import { listPages } from "../../services/pageService";
import useResponseState from "../../hooks/useResponseState";
import { Page } from "../pages/Page";
import CloseButton from "../common/button/CloseButton";

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
            padding: '20px',
            margin: '12px',
            flex: '1 1 0px'
        },
        fieldDiv: {
            marginTop: '20px',
            marginBottom: '20px'
        },
        field: {
            width: '90%',
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
        },
        info: {
            margin: '15px 7px'
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
                        Translations
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

export type ServerSettings = {
    appAddress?: string,
    customApiAddress?: string,
    website: {
        title?: string
        description?: string
        keywords?: string
        askNotifications: string
    }
}

interface NotificationValues {
    [key: string]: { name: string }
}

const askNotificationOptions: NotificationValues = {
    "disabled": { name: "Only the button(s)" },
    "1": { name: "Immediately" },
    "20": { name: "After 20 seconds" },
    "45": { name: "After 40 seconds" },
    "60": { name: "After 60 seconds" },
}

function ServerSettingsForm() {
    const classes = useStyles();
    const context = useContext(AppContext)

    const updateRequest = useRequest(undefined, {
        errorMessage: 'Update request might have failed. ' +
            'If something broke, please wait a few minutes and contact support if the problems continue!'
    });
    // Select components don't want to work well with formik :(
    const [askNotifications, setAskNotifications] = useState<string>('disabled');
    const serverInfo = useRequest(
        () => getOrCreateServer({ email: context.user.email }, false),
        {},
        (res) => setAskNotifications(res.data?.website?.askNotifications))

    const [popupOpen, setPopupOpen] = useState(false);
    const [pingingServer, setPingingServer] = useState(false);

    const validate = (settings: ServerSettings) => {
        const errors: FormikErrors<ServerSettings> = {};
        if (settings.appAddress && !isURL(settings.appAddress)) {
            errors.appAddress = 'Invalid URL'
        }
        return errors;
    }

    const loading = serverInfo.loading || updateRequest.loading || pingingServer
    const error = serverInfo.error || updateRequest.error

    const pageRequest = useRequest(listPages)
    // If used for anything else it is recommended to use a custom parser to map the pages to real page instances
    const [pages] = useResponseState<Page[]>(pageRequest.response, [], res => res.data.map((it: any) => new Page(it)));

    return (
        <div>
            <Typography className={classes.sectionTypography} variant="h6" align="center">
                Other Settings
            </Typography>

            {loading ? <LinearProgress/> : <RetryButton error={error ? { ...error, retry: undefined } : undefined}/>}
            {pingingServer && <p style={{ textAlign: 'center' }}>This is taking an unexpectedly long time...</p>}

            <Dialog open={popupOpen}>
                <DialogContent style={{ padding: '25px' }}>
                    <CloseButton onClick={() => setPopupOpen(false)}/>
                    <Typography variant="h5" color="secondary">Your app is restarting...</Typography>
                    <p>This may take a few minutes.</p>
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
                        values.website.askNotifications = askNotifications
                        setPopupOpen(true)
                        updateRequest.performRequest(
                            () => updateServer(values),
                            (res) => {
                                actions.setSubmitting(false)
                                setPopupOpen(false)
                            },
                            (err) => {
                                const status = err.response?.status
                                // Timeout (probably)
                                if (!status || status === 408 || status === 504 || status === 524) {
                                    setPingingServer(true)
                                    waitForServer(() => {
                                        actions.setSubmitting(false)
                                        setPopupOpen(false)
                                        setPingingServer(false)
                                        error?.clearError && error.clearError()
                                    })
                                } else {
                                    actions.setSubmitting(false)
                                    setPopupOpen(false)
                                }
                            }
                        );
                    } else {
                        actions.setSubmitting(false)
                    }
                }}
            >
                {({ submitForm, isSubmitting }) => (
                    <Paper className={classes.paper}>
                        <Form>
                            <p className={classes.info}>
                                Create a new DNS <b>A record </b>
                                to <b>{backendURL.replace("https://", "").replace(/\/.*$/, '')} </b>
                                and enter the address for your loyalty app below.
                            </p>
                            <TextField
                                className={classes.field}
                                placeholder="e.g yourdomain.com/app or app.yourdomain.com"
                                name="appAddress"
                                type="text"
                                label="Loyalty App Address"
                            />
                            <TextField
                                className={classes.field}
                                placeholder={`e.g your business name`}
                                name="website.title"
                                type="text"
                                label="App Title"
                                multiline
                            />
                            <TextField
                                className={classes.field}
                                name="website.description"
                                placeholder="Short description of the app/site"
                                type="text"
                                label="App Description"
                                multiline
                            />
                            <TextField
                                className={classes.field}
                                name="website.keywords"
                                placeholder="Comma separated keywords"
                                type="text"
                                label="App Keywords"
                                multiline
                            />
                            <FormHelperText
                                style={{ marginTop: '10px' }}
                            >Select when the user is asked to enable push notifications</FormHelperText>
                            <Select
                                disabled={isSubmitting}
                                className={classes.field}
                                type="text"
                                defaultValue="disabled"
                                value={askNotifications}
                                onChange={(e) => setAskNotifications(e.target.value as string)}
                                input={<Input/>}
                                inputProps={{
                                    name: 'askNotifications',
                                    id: 'ask-notifications-select',
                                }}
                            >
                                {Object.entries(askNotificationOptions).map(([k, v]) => (
                                    <MenuItem key={k} value={k}>
                                        {v.name}
                                    </MenuItem>
                                ))}
                                {pages.filter(it => it.isDiscarded()).map(page => (
                                    <MenuItem key={page._id} value={page.pathname}>
                                        {`On "/${page.pathname}" page`}
                                    </MenuItem>
                                ))}
                            </Select>

                            <p style={{ margin: '18px 0px 6px 0px', color: '#5e5e5e' }}>
                                Changes to some settings may take longer (up to a few hours) to be visible on the
                                website.
                            </p>

                            <div>
                                <Button
                                    className={classes.updateButton}
                                    disabled={isSubmitting}
                                    variant="contained"
                                    size="small"
                                    onClick={() => submitForm()}
                                >Update & Restart</Button>
                            </div>
                        </Form>
                    </Paper>
                )}
            </Formik>
            }
        </div>
    )
}