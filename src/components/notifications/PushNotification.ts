export class PushNotification {

    title: string
    message: string
    link: string
    sent?: Date
    id: string = `new_notification${Math.random()}`

    constructor(data: any) {
        this.title = data.title
        this.message = data.message
        this.link = data.link
        this.sent = data.sent ? new Date(data.sent) : undefined
    }
}