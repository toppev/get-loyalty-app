import { post } from "../config/axios";

/**
 * Asks the user to enable push notifications as (and if) specified in the settings.
 * Either after a timeout or on a specific page.
 */
export function startSubscribeTask() {
    // Click a button to enable notifications (IMO better UX)
    [...document.getElementsByClassName('enable-notifications')].forEach(el => el.onclick = subscribeUser)
    // Timers/pages
    let settingValue = process.env.REACT_APP_ASK_NOTIFICATIONS
    const time = parseInt(settingValue, 10);
    if (!Number.isNaN(time)) {
        setTimeout(subscribeUser, time * 1000)
    } else {
        if (!settingValue || settingValue === 'disabled') return
        if (settingValue[0] !== '/') settingValue = `/${settingValue}`
        // Just do polling (pretty stupid) but this way we can keep everything here
        const polling = setInterval(() => {
            if (document.location.pathname.endsWith(settingValue)) {
                subscribeUser()
                clearInterval(polling)
            }
        }, 1000)
    }
}

const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)

// Call this function to ask for the permission to show notifications
function subscribeUser() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(function (registration) {
                if (!registration.pushManager) {
                    console.log('Push manager unavailable.')
                    return
                }
                registration.pushManager.getSubscription()
                    .then(function (subscription) {
                        if (subscription !== null) {
                            console.log('Existing subscription found')
                            // Not sure if we should send the existing subscription?
                            sendSubscription(subscription).then(() => console.log('Subscription updated'))
                        } else {
                            registration.pushManager.subscribe({
                                applicationServerKey: convertedVapidKey,
                                userVisibleOnly: true,
                            }).then(function (newSubscription) {
                                sendSubscription(newSubscription).then(() => console.log('Subscription added'))
                            }).catch(function (e) {
                                console.error('An error occurred during the subscription process', Notification.permission, e)
                            })
                        }
                    })
            }).catch(function (e) {
            console.error('An error occurred during Service Worker registration.', e)
        })
    }
}

function sendSubscription(subscription) {
    return post(`/notifications/subscribe`, subscription)
}

// https://github.com/GoogleChromeLabs/web-push-codelab/issues/46#issuecomment-429273981
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}