import React from "react"
import { PushNotification } from "./PushNotification"
import { Card, CardProps, createStyles, LinearProgress, Paper, Theme, Typography } from "@material-ui/core"
import RetryButton from "../common/button/RetryButton"
import { makeStyles } from "@material-ui/core/styles"
import RequestError from "../../util/requestError"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: '10px',
      padding: '2px 10px'
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
    },
    receivers: {
      fontSize: '12px',
      color: theme.palette.grey[500]
    }
  }))

interface NotificationHistoryProps {
  history: PushNotification[]
  newNotifications?: PushNotification[]
  loading?: boolean
  error?: RequestError
}

export default function (props: NotificationHistoryProps) {

  const { error, history, loading, newNotifications } = props
  const empty = !history.length && !newNotifications?.length
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" className={classes.typography}>Notification History</Typography>
      {loading && <LinearProgress/>}
      <RetryButton error={error}/>
      {newNotifications?.map(n => (
        <NotificationCard key={n.id} notification={n} className={`${classes.card} ${classes.newCard}`}/>
      ))}
      {history.map(n => (
        <NotificationCard key={n.id} notification={n} className={classes.card}/>
      ))}
      {empty && !loading &&
      <Typography className={classes.noNotifications} variant="h6">You haven't sent any notifications</Typography>}
    </Paper>
  )
}

interface NotificationCardProps extends CardProps {
  notification: PushNotification
}

function NotificationCard({ notification, ...cardProps }: NotificationCardProps) {
  const classes = useStyles()
  const { sent, title, message, receivers } = notification
  return (
    <Card {...cardProps}>
      <p className={classes.sentDate}>{sent?.toLocaleString()}</p>
      <Typography variant="h6" className={classes.title}>{title}</Typography>
      <p className={classes.message}>{message}</p>
      {receivers !== undefined && <p className={classes.receivers}>Receivers: {receivers}</p>}
    </Card>
  )
}
