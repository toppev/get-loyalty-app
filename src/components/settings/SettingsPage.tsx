import { Box, createStyles, Paper, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikErrors } from "formik";
import SaveChangesSnackbar from "../common/SaveChangesSnackbar";
import AppContext, { Business } from "../../context/AppContext";
import _ from "lodash";
import { TextField } from "formik-material-ui";
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import { isDomain } from "../../util/Validate";
import { updateBusiness } from "../../services/businessService";
import { Alert } from "@material-ui/lab";
import { APP_URL } from "../../config/axios";
import useRequest from "../../hooks/useRequest";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        typography: {
            textAlign: 'center',
            color: theme.palette.grey[300],
            margin: '15px'
        },
        sectionTypography: {
            color: theme.palette.grey[800]
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
        if (value.config.loyaltyWebsite?.trim() && !isDomain(value.config.loyaltyWebsite)) {
            // FIXME: breaks #submitForm
            // errors.config.loyaltyWebsite = "That doesn't look like a domain!"
        }
        // FIXME: does not work correctly
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
                    <Box display="flex" flexDirection={bigScreen ? "row" : "column"}>
                        <Paper className={classes.paper}>
                            <Typography className={classes.sectionTypography} variant="h6" align="center">
                                Translations & Names
                            </Typography>
                            <p className={classes.description}
                            >You can translate messages and other things here.</p>
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
                            </Form>
                        </Paper>

                        <Paper className={classes.paper}>
                            <Typography className={classes.sectionTypography} variant="h6" align="center">
                                Other
                            </Typography>
                            <Form>
                                <TextField
                                    className={classes.field}
                                    name="config.loyaltyWebsite"
                                    type="text"
                                    label="Your loyalty app domain"
                                    placeholder="yourdomain.com"
                                />
                                <Tooltip
                                    enterDelay={200}
                                    leaveDelay={300}
                                    title={
                                        <React.Fragment>
                                            <Typography>{`Your domain`}</Typography>
                                            Redirect your domain (or a subdomain) to "{APP_URL}" and enter your domain
                                            here
                                        </React.Fragment>
                                    }
                                >
                                    <HelpIcon className={classes.helpIcon}/>
                                </Tooltip>
                            </Form>
                        </Paper>

                        <SaveChangesSnackbar
                            open={!saved}
                            buttonDisabled={isSubmitting}
                            onSave={submitForm}
                        />
                    </Box>
                )}
            </Formik>
        </div>
    )
}