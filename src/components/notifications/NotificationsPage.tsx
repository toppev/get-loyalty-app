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
                margin: '30px',
                minWidth: '450px',
                maxHeight: '400px',
            }
        }
    }));

export default function () {

    const classes = useStyles();
    const context = useContext(AppContext);
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [newNotifications, setNewNotifications] = useState<PushNotification[]>([]);

    // TODO: maybe a google maps link if website doesn't exist but the address does?
    const initialNotification = new PushNotification('', '', context.business.public.website, new Date());

    const notificationSent = (notification: PushNotification) => {
        setNewNotifications([...newNotifications, notification]);
    }

    return (
        <div>
            <Box display="flex" flexDirection={bigScreen ? "row" : "column"} className={classes.box}>
                <NotificationForm onSubmitted={notificationSent} notification={initialNotification}/>
                <NotificationHistory addToHistory={newNotifications}/>
            </Box>
        </div>
    )

}