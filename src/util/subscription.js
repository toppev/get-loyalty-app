import { getBusinessUrl, onReady, post } from "../config/axios";

const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)

// Call this function to ask for permission to show notifications
export function subscribeUser() {
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
                            sendSubscription(subscription)
                        } else {
                            registration.pushManager.subscribe({
                                applicationServerKey: convertedVapidKey,
                                userVisibleOnly: true,
                            }).then(function (newSubscription) {
                                console.log('Subscription added')
                                sendSubscription(newSubscription)
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
    return onReady(() => post(`${getBusinessUrl()}/notifications/subscribe`, subscription))
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