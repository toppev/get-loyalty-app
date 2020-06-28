import { deleteRequest, post } from "../config/axios";
import { Notification } from "../components/PopupNotification";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";

function subscribeMessage(userId: string, identifier: string) {
    return post(`${process.env.REACT_APP_POLLING_API_URL}/${identifier}_${userId}`, {}, true)
}

function unsubscribeMessage(userId: string, identifier: string) {
    return deleteRequest(`${process.env.REACT_APP_POLLING_API_URL}/${identifier}_${userId}`, true)
}

function useSubscribe(identifiers: string[]) {
    const [notification, setNotification] = useState<Notification | undefined>()

    const { user } = useContext(AppContext)

    const subscribeRecursively = (id: string) => {
        subscribeMessage(user.id, id)
            .then(res => {
                if (res.data.message) {
                    setNotification(res.data)
                } else {
                    console.log('Failed to parse a notification from the response.', res.data)
                }
                subscribeRecursively(id)
            })
            .catch(err => {
                // Resubscribe if timed out
                if (err?.response?.status === 408) {
                    subscribeRecursively(id)
                } else {
                    console.log('An error occurred while subscribing to messages.', err)
                }
            })
    }

    if (user?.id) {
        identifiers.forEach(subscribeRecursively)
    }

    return {
        notification
    }

}

export {
    subscribeMessage,
    unsubscribeMessage,
    useSubscribe
}