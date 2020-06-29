import { useSubscribe } from "../services/messageService";
import PopupNotification from "./PopupNotification";
import React from "react";

interface NotificationHandlerProps {
    onRefresh: (id: any) => any
}

export default function (props: NotificationHandlerProps) {

    // Subscribe to long polling messages/notifications (e.g "Scanned", "Received a reward")
    // We could subscribe when needed or migrate to websockets but this is good enough for now
    const { notification } = useSubscribe(['scan', 'reward_get', 'scan_get', 'reward_use'])

    if (notification) {
        const { refresh, vibrate } = notification
        // Refresh the pages by default if not set to false
        if (refresh !== false) {
            props.onRefresh(notification.id)
        }
        if (vibrate) {
            window.navigator.vibrate(vibrate === true ? 200 : vibrate)
        }
    }

    return (
        <PopupNotification notification={notification}/>
    )

}