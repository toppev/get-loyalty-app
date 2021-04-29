import { Button, createStyles, LinearProgress, Paper, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikErrors } from "formik";
import RetryButton from "../common/button/RetryButton";
import SendIcon from "@material-ui/icons/Send";
import React from "react";
import { PushNotification } from "./PushNotification";
import useRequest from "../../hooks/useRequest";
import { sendPushNotification } from "../../services/pushNotificationService";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      textAlign: 'center',
      padding: '15px',
      height: '400px'
    },
    form: {
      padding: '20px',
      width: '100%',
      marginTop: theme.spacing(1),
    },
    subscribed: {
      color: theme.palette.grey[700]
    },
    field: {
      width: '100%',
      margin: '12px 0px'
    },
    submitDiv: {
      paddingTop: '20px'
    },
    submitButton: {},
    cooldownDiv: {
      margin: '30px 10px',
    },
    cooldownTitle: {
      fontSize: '14px'
    },
    cooldownText: {
      color: theme.palette.grey[600],
      fontSize: '12px'
    }

  }));

interface NotificationFormProps {
  notification: PushNotification
  cooldownExpires?: Date
  setCooldownExpires: (s: Date) => any
  onSubmitted?: (notification: PushNotification) => any
  usersSubscribed: number
}

export default function (props: NotificationFormProps) {

  const { setCooldownExpires, onSubmitted, notification, cooldownExpires } = props;

  const classes = useStyles();
  const { loading, error, performRequest } = useRequest();

  const subsRounded = Math.round(props.usersSubscribed / 10) * 10

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h5">Notification</Typography>
      {subsRounded > 0 && <p className={classes.subscribed}>About {subsRounded} customers have enabled push notifications.</p>}
      <Formik
        initialValues={notification}
        validate={validate}
        onSubmit={(newNotification, actions) => {
          if (window.confirm('Are you sure you want to send this notification to all customers that can receive push notifications?')) {
            performRequest(
              () => sendPushNotification(newNotification),
              (res) => {
                actions.setSubmitting(false)
                setCooldownExpires(new Date(res.data.cooldownExpires))
                if (onSubmitted) {
                  onSubmitted(newNotification);
                }
              },
              () => actions.setSubmitting(false)
            )
          }
        }}
      >{({ submitForm, isSubmitting }) => (
        <Form className={classes.form}>
          <TextField
            className={classes.field}
            name="title"
            type="text"
            label="Title"
            placeholder="It's pizza friday!"
          />
          <TextField
            className={classes.field}
            name="message"
            type="text"
            label="Message"
            placeholder="Get your pizza from us."
          />
          <TextField
            className={classes.field}
            name="link"
            type="text"
            label="Notification link (optional)"
            placeholder="Your website or link to anything else (e.g a feedback form)"
          />
          {loading && <LinearProgress/>}
          <RetryButton error={error}/>
          <div className={classes.submitDiv}>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="primary"
              disabled={isSubmitting || !!cooldownExpires}
              startIcon={(<SendIcon/>)}
              onClick={submitForm}
            >Send Notification</Button>
            {cooldownExpires &&
            <div className={classes.cooldownDiv}>
              <Typography
                color="secondary"
                className={classes.cooldownTitle}
              >Cooldown expires {cooldownExpires.toLocaleString(undefined, { hour12: false })}
              </Typography>
              <p className={classes.cooldownText}>You are still on cooldown and can not send push
                notifications until it expires.</p>
            </div>
            }
          </div>
        </Form>
      )}
      </Formik>
    </Paper>
  )
}

function validate(values: PushNotification) {
  const errors: FormikErrors<PushNotification> = {};
  if (!values.title.trim().length) {
    errors.title = 'Title can not be empty'
  }
  if (!values.message.trim().length) {
    errors.message = 'Message can not be empty'
  }
  return errors;
}
