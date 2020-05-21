export class PushNotification {

    constructor(
        public title: string,
        public message: string,
        public link: string,
        public date: Date,
        public _id: string = `new_notification${Math.random()}`,
    ) {
    }
}