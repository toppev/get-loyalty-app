import React from "react";
import useRequest from "../../hooks/useRequest";
import { listNotificationHistory } from "../../services/pushNotificationService";
import useResponseState from "../../hooks/useResponseState";
import { PushNotification } from "./PushNotification";
import { Card, CardProps, createStyles, LinearProgress, Paper, Theme, Typography } from "@material-ui/core";
import RetryButton from "../common/button/RetryButton";
import { makeStyles } from "@material-ui/core/styles";
import { Form } from "formik";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            margin: '10px',
            padding: '10px'
        },
        newCard: {
            backgroundColor: 'powderblue'
        },
        paper: {
            backgroundColor: theme.palette.grey[300],
            overflow: 'auto'
        },
        typography: {
            margin: '20px',
            textAlign: 'center',
        }
    }));

interface NotificationHistoryProps {
    addToHistory?: PushNotification[]
}

export default function (props: NotificationHistoryProps) {

    const classes = useStyles();

    const { loading, error, response } = useRequest(listNotificationHistory);
    const testNotification = new PushNotification('A nice title', 'Some random message', 'www.....com', new Date());
    const testNotification1 = new PushNotification('A nice title', 'Some random message', 'www.....com', new Date());
    const testNotification2 = new PushNotification('A nice title', 'Some random message', 'www.....com', new Date());
    const testNotification3 = new PushNotification('A nice title', 'Some random message', 'www.....com', new Date());

    const [history, setHistory] = useResponseState<PushNotification[]>(response, [testNotification, testNotification1, testNotification2, testNotification3]);

    return (
        <Paper className={classes.paper}>
            <Typography variant="h5" className={classes.typography}>Notification History</Typography>
            {loading && <LinearProgress/>}
            {error && <RetryButton error={error}/>}
            {props.addToHistory?.map(n => (
                <NotificationCard notification={n} className={`${classes.card} ${classes.newCard}`}/>
            ))}
            {history.map(n => (
                <NotificationCard notification={n} className={classes.card}/>
            ))}
        </Paper>
    )
}

interface NotificationCardProps extends CardProps {
    notification: PushNotification
}

function NotificationCard({ notification, ...cardProps }: NotificationCardProps) {

    const { date, title, message } = notification;

    return (
        <Card {...cardProps}>
            <p>{date.toLocaleString()}</p>
            <Typography variant="h6">{title}</Typography>
            <p>{message}</p>
        </Card>
    )
}