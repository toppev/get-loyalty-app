export class PushNotification {

    constructor(
        public title: string,
        public message: string,
        public url: string,
        public date: Date,
        public _id: string = `new_notification${Math.random()}`,
    ) {
    }
}