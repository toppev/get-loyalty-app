import { deleteRequest, post } from "../config/axios";
import { Notification } from "../components/notification/PopupNotification";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";

function subscribeMessage(userId: string, identifier: string) {
    return post(`${process.env.REACT_APP_POLLING_API_URL}/${identifier}_${userId}`, {}, true)
}

function unsubscribeMessage(userId: string, identifier: string) {
    return deleteRequest(`${process.env.REACT_APP_POLLING_API_URL}/${identifier}_${userId}`, true)
}

// Don't use state because this works better
const subscribedTo: string[] = []

function useSubscribe(identifiers: string[]) {
    const [notification, setNotification] = useState<Notification | undefined>()

    const { user } = useContext(AppContext)

    const subscribeRecursively = (id: string) => {
        if (!subscribedTo.includes(id)) {
            subscribedTo.push(id)
            subscribeMessage(user.id, id)
                .then(res => {
                    if (res.data.message) {
                        const data = res.data
                        if (data.id) data.id = Math.random()
                        setNotification(data)
                    } else {
                        console.log('Failed to parse a notification from the response.', res.data)
                    }
                    resub(id)
                })
                .catch(err => {
                    // Resubscribe if timed out
                    if (err?.response?.status === 408) {
                        resub(id)
                    } else {
                        console.log('An error occurred while subscribing to messages. Not trying anymore.')
                    }
                })
        }
    }

    const resub = (id: string) => {
        const index = subscribedTo.indexOf(id);
        if (index !== -1) subscribedTo.splice(index, 1);
        subscribeRecursively(id)
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