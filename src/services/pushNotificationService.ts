import { PushNotification } from "../components/notifications/PushNotification";
import { BUSINESS_ID, get, post } from "../config/axios";

async function sendPushNotification(data: PushNotification) {
    return post(`/business/${BUSINESS_ID}/notifications`, data);
}

async function listNotificationHistory() {
    return get(`/business/${BUSINESS_ID}/notifications`);
}


export {
    sendPushNotification,
    listNotificationHistory
}