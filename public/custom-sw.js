import { getBusinessUrl } from "../src/config/axios";

self.addEventListener('push', event => {
    const data = event.data.json()
    const options = {
        icon: `${getBusinessUrl(true)}/icon`,
        badge: `${getBusinessUrl(true)}/icon`,
        ...data,
    }
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
})

self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    const link = event.notification?.data?.link;
    if (link) {
        event.waitUntil(
            clients.openWindow(link)
        );
    }
})