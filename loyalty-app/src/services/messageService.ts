/**
 * Manages subscribing to messages (not push notifications!).
 * The server sends notification messages via this system. For example, when scanning.
 */

// TODO: refactor to use websockets!!!

import { Notification } from "../components/notification/PopupNotification"
import { useContext, useState } from "react"
import { AppContext } from "../AppContext"
import client from "../config/axios"

function subscribeMessage(userId: string, identifier: string) {
  return client.post(`${process.env.REACT_APP_POLLING_API_URL}/${identifier}_${userId}`, {}, { withCredentials: false })
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
    subscribeMessage(user.id, id)
      .then(res => {
        resub(id)
        const data = res.data
        console.log('notification data: ', data)
        setNotification(data)
      })
      .catch(err => {
        const status = err?.response?.status
        if ([408, 504].includes(status)) resub(id)
      })
  }

  const resub = (id: string) => {
    const index = subscribedTo.indexOf(id)
    if (index !== -1) subscribedTo.splice(index, 1)
    subscribeRecursively(id)
  }

  if (user?.id) {
    identifiers.forEach(subscribeRecursively)
  }

  return {
    notification,
    setNotification
  }

}

export {
  useSubscribe
}
