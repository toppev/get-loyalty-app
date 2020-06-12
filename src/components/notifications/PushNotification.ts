export class PushNotification {

    title: string
    message: string
    link: string
    sent?: Date
    receivers?: number
    id: string = `new_notification${Math.random()}`

    constructor(data: any) {
        this.title = data.title
        this.message = data.message
        this.link = data.link
        this.sent = data.sent ? new Date(data.sent) : undefined
        this.receivers = data.receivers;
    }

    toRequestObject() {
        const res = { ...this }
        delete res.id
        delete res.sent
        delete res.receivers
        return res;
    }
}