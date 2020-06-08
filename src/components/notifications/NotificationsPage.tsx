import React, { useContext, useState } from "react";
import { Box, createStyles, Theme, useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NotificationForm from "./NotificationForm";
import { PushNotification } from "./PushNotification";
import AppContext from "../../context/AppContext";
import NotificationHistory from "./NotificationHistory";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {
            "& > .MuiPaper-root": {
                height: '550px',
                marginTop: '20px',
                [theme.breakpoints.up('sm')]: {
                    minWidth: '550px',
                    margin: '20px',
                },
            }
        },
    }));

export default function () {

    const classes = useStyles();
    const context = useContext(AppContext);
    const bigScreen = useMediaQuery(useTheme().breakpoints.up('md'));

    const [newNotifications, setNewNotifications] = useState<PushNotification[]>([]);

    // IDEA: maybe a google maps link if website doesn't exist but the address does?
    const initialNotification = new PushNotification({
        title: '',
        message: '',
        link: context.business.config.loyaltyWebsite,
        date: new Date()
    });

    const notificationSent = (notification: PushNotification) => setNewNotifications([...newNotifications, notification]);

    return (
        <div>
            <Box display="flex" flexDirection={bigScreen ? "row" : "column"}
                 className={classes.box}>
                <NotificationForm onSubmitted={notificationSent} notification={initialNotification}/>
                <NotificationHistory addToHistory={newNotifications}/>
            </Box>
        </div>
    )

}