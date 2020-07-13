import { PushNotification } from "../components/notifications/PushNotification";
import { get, post } from "../config/axios";

async function sendPushNotification(data: PushNotification) {
    return post(`/notifications`, data);
}

async function listNotificationHistory() {
    return get(`/notifications`);
}


export {
    sendPushNotification,
    listNotificationHistory
}