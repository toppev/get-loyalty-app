import {
    Box,
    createStyles,
    Divider,
    LinearProgress,
    makeStyles,
    Paper,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import { Form, Formik, FormikErrors } from "formik";
import _ from 'lodash';
import React, { useContext, useState } from "react";
import AppContext, { Business } from "../../context/AppContext";
import SaveChangesSnackbar from "../common/SaveChangesSnackbar";
import { TextField } from "formik-material-ui";
import HelpIcon from "@material-ui/icons/Help";
import Tooltip from "@material-ui/core/Tooltip";
import { updateBusiness } from "../../services/businessService";
import useRequest from "../../hooks/useRequest";
import RetryButton from "../common/button/RetryButton";
import PrivacyLink from "../common/PrivacyLink";
import { isEmail } from "../../util/Validate";
import IdText from "../common/IdText";
import CustomerLevelView from "./levels/CustomerLevelView";
import IconUploadForm from "./IconUploadForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        page: {
            paddingBottom: '270px'
        },
        paper: {
            padding: '25px',
            margin: '20px',
            flex: '1 1 0px'
        },
        field: {
            width: '100%',
            marginTop: '25px',
            marginBottom: '3px'
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
        sectionTypography: {
            color: 'gray'
        },
        helpIcon: {
            marginLeft: '20px'
        },
        infoText: {
            fontSize: '11px'
        },
        divider: {
            margin: '35px 0px',
            backgroundColor: theme.palette.grey[600]
        }
    }));

export default function () {
    const classes = useStyles();
    const context = useContext(AppContext);

    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [saved, setSaved] = useState(true);

    const request = useRequest()
    const { error } = request;

    const validateAndSnackbar = (value: Business) => {
        const errors: FormikErrors<Business> = {};
        if (value.email && !isEmail(value.email)) {
            errors.email = 'Invalid email address'
        }
        setSaved(_.isEqual(value, context.business));
        return errors;
    }

    return (
        <div className={classes.page}>
            <Typography
                className={classes.mainTitle}
                variant="h4"
                align="center"
            >Business Details</Typography>
            {error && <RetryButton error={error}/>}
            {/*
                Workaround because Formik doesn't change the values correctly
                Comparing the length of the business id will make sure the page waits for the business to load.
             */}
            {(context.business._id?.length !== 24) ? <LinearProgress/> : (
                <Formik
                    initialValues={context.business}
                    validateOnChange
                    enableReinitialize
                    validate={validateAndSnackbar}
                    onSubmit={(business, actions) => {
                        actions.setSubmitting(true)
                        request.performRequest(
                            () => updateBusiness(business),
                            (res) => {
                                setSaved(true);
                                context.setBusiness(res.data);
                                actions.setSubmitting(false);
                            },
                            () => actions.setSubmitting(false)
                        );

                    }}
                >
                    {({ submitForm, isSubmitting, handleChange }) => (
                        <Box display="flex" flexDirection={bigScreen ? "row" : "column"}>
                            <Paper className={classes.paper}>
                                <Typography className={classes.sectionTypography} variant="h6" align="center">
                                    Public Information (optional)
                                    <Tooltip
                                        enterDelay={200}
                                        leaveDelay={300}
                                        title={
                                            <React.Fragment>
                                                <Typography>Public information</Typography>
                                                Include public information that anyone can see.
                                            </React.Fragment>
                                        }
                                    >
                                        <HelpIcon className={classes.helpIcon}/>
                                    </Tooltip>
                                </Typography>
                                <Form>
                                    <TextField
                                        className={classes.field}
                                        name="public.name"
                                        type="text"
                                        label="Business Name"
                                        placeholder="My Business"
                                    />
                                    <TextField
                                        multiline
                                        className={classes.field}
                                        name="public.description"
                                        type="text"
                                        label="Description"
                                        placeholder="A short user-friendly description of your business"
                                    />
                                    <TextField
                                        className={classes.field}
                                        name="public.address"
                                        type="text"
                                        label="Public Address"
                                    />
                                    <TextField
                                        className={classes.field}
                                        name="public.website"
                                        type="text"
                                        label="Website (if any)"
                                    />
                                </Form>
                                <IconUploadForm/>
                                <IdText id={context.business._id}/>
                            </Paper>
                            <Paper className={classes.paper}>
                                <Typography className={classes.sectionTypography} variant="h6" align="center">Other
                                    Details</Typography>
                                <Form>
                                    <TextField
                                        className={classes.field}
                                        name="email"
                                        type="text"
                                        label="Private Email"
                                        placeholder="example@email.com"
                                    />
                                    <p className={classes.infoText}>We may send updates and more to this email. We won't
                                        spam you!</p>
                                    <PrivacyLink/>
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
            )}

            <Divider className={classes.divider}/>

            <Typography
                className={classes.mainTitle}
                variant="h4"
                align="center"
            >Customer Levels</Typography>

            <CustomerLevelView/>
        </div>
    )
}