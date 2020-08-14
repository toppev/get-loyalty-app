import { Notification } from "../components/notification/PopupNotification";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";

function subscribeMessage(userId: string, identifier: string) {
    return fetch(`${process.env.REACT_APP_POLLING_API_URL}/${identifier}_${userId}`, {
        "body": "{}",
        "method": "POST",
    });
}

function unsubscribeMessage(userId: string, identifier: string) {
    return fetch(`${process.env.REACT_APP_POLLING_API_URL}/${identifier}_${userId}`, {
        "body": "{}",
        "method": "DELETE",
    });
}

// Don't use state because this works better
const subscribedTo: string[] = []

function useSubscribe(identifiers: string[]) {
    const [notification, setNotification] = useState<Notification | undefined>()

    const { user } = useContext(AppContext)

    const subscribeRecursively = (id: string) => {
        if (subscribedTo.includes(id)) {
            return
        }
        subscribedTo.push(id)
        subscribeMessage(user.id, id).then(res => {
            const { status } = res;
            // Resubscribe on success or timeout
            if ((status >= 200 && status < 300) || status === 408 || status === 504) {
                resub(id)
                const contentType = res.headers.get("content-type")
                if (contentType?.indexOf("application/json") !== -1) {
                    res.json().then(data => {
                        if (data.message) {
                            if (data.id) data.id = Math.random()
                            setNotification(data)
                        } else {
                            console.log('Failed to parse a notification from the response.', data)
                        }
                    })
                }
            }
        })
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