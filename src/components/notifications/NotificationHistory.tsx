import React from "react";
import useRequest from "../../hooks/useRequest";
import { listNotificationHistory } from "../../services/pushNotificationService";
import useResponseState from "../../hooks/useResponseState";
import { PushNotification } from "./PushNotification";
import { Card, CardProps, createStyles, LinearProgress, Paper, Theme, Typography } from "@material-ui/core";
import RetryButton from "../common/button/RetryButton";
import { makeStyles } from "@material-ui/core/styles";


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
        },
        noNotifications: {
            marginTop: '50px',
            color: theme.palette.grey[500],
            textAlign: 'center'
        },
        sentDate: {
            color: theme.palette.grey[500]
        },
        title: {
            fontSize: '26px',
            color: theme.palette.grey[800]
        },
        message: {
            fontSize: '20px',
            color: theme.palette.grey[700]
        }
    }));

interface NotificationHistoryProps {
    addToHistory?: PushNotification[]
}

export default function (props: NotificationHistoryProps) {

    const classes = useStyles();

    const { loading, error, response } = useRequest(listNotificationHistory);

    const [history, setHistory] = useResponseState<PushNotification[]>(response, [], res => res.data.notifications.map((it: any) => new PushNotification(it)));

    const empty = !history.length && !props.addToHistory?.length;

    return (
        <Paper className={classes.paper}>
            <Typography variant="h5" className={classes.typography}>Notification History</Typography>
            {loading && <LinearProgress/>}
            {error && <RetryButton error={error}/>}
            {props.addToHistory?.map(n => (
                <NotificationCard key={n.id} notification={n} className={`${classes.card} ${classes.newCard}`}/>
            ))}
            {history.map(n => (
                <NotificationCard key={n.id} notification={n} className={classes.card}/>
            ))}
            {empty && <Typography className={classes.noNotifications} variant="h6">You haven't sent any
                notifications</Typography>}
        </Paper>
    )
}

interface NotificationCardProps extends CardProps {
    notification: PushNotification
}

function NotificationCard({ notification, ...cardProps }: NotificationCardProps) {
    const classes = useStyles();
    const { sent, title, message } = notification;
    return (
        <Card {...cardProps}>
            <p className={classes.sentDate}>{sent?.toLocaleString()}</p>
            <Typography variant="h6" className={classes.title}>{title}</Typography>
            <p className={classes.message}>{message}</p>
        </Card>
    )
}