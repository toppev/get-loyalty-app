self.addEventListener('push', event => {
    const data = event.data.json()
    const options = {
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