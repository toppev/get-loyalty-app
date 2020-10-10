import { post } from "../config/axios";
import { someParentHasClassname } from "../util/classUtils";


/** Class that triggers push notification prompt when clicked */
const enableNotificationsClass = 'enable-notifications'

/** Selector that will be hidden when push notifications are enabled */
const hideNotificationSelector = `.${enableNotificationsClass}, .hide-notifications`

/** Whether to hide the classes if service worker or push manager is not supported */
const hideIfNotSupported = true

/**
 * Asks the user to enable push notifications as (and if) specified in the settings.
 * Either after a timeout or on a specific page.
 */
export function startSubscribeTask() {
    getPushManager()
        .then((pm) => {
            // Hide if granted/denied
            if (Notification.permission !== "default") {
                hideNotificationClasses()
            }
        })
        // Or if push notifications are not supported
        .catch(() => hideIfNotSupported && hideNotificationClasses())

    // Click a button to enable notifications (IMO better UX)
    window.onclick = e => {
        if (someParentHasClassname(e.target, enableNotificationsClass)) {
            subscribeUser()
        }
    }

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
    getPushManager().then(pushManager => {
        pushManager.getSubscription()
            .then((subscription) => {
                if (subscription !== null) {
                    console.log('Existing subscription found')
                    hideNotificationClasses()
                    // Not sure if we should send the existing subscription?
                    sendSubscription(subscription).then(() => console.log('Subscription updated'))
                } else {
                    pushManager.subscribe({
                        applicationServerKey: convertedVapidKey,
                        userVisibleOnly: true,
                    }).then((newSubscription) => {
                        sendSubscription(newSubscription).then(() => {
                            console.log('Subscription added')
                            hideNotificationClasses()
                        })
                    }).catch((e) => {
                        console.error('Failed to add a new subscription', Notification.permission, e)
                        hideNotificationClasses()
                    })
                }
            })
    })
}

/**
 * Hides push notification classes
 */
function hideNotificationClasses() {
    const style = document.createElement('style')
    // language=CSS
    style.textContent = `
      ${hideNotificationSelector} {
        display: none !important;
      }
    `
    document.head.append(style);
}

function getPushManager() {
    return new Promise((resolve, reject) => {
        if (!('serviceWorker' in navigator)) {
            reject('serviceWorker not supported')
        } else {
            navigator.serviceWorker.ready.then((registration) => {
                if (!registration.pushManager) {
                    console.log('pushManager unavailable.')
                    reject('pushManager unavailable')
                } else {
                    resolve(registration.pushManager)
                }
            })
        }
    })
}

function sendSubscription(subscription) {
    return post(`/notifications/subscribe`, subscription)
}

// Edited from https://github.com/GoogleChromeLabs/web-push-codelab/issues/46#issuecomment-429273981
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}