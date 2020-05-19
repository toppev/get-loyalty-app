export default class Category {

    constructor(
        public _id: string,
        public name: string,
        public parents: string[] = [],
        public children: string[] = [],
        public keywords: string[] = [],
        public official: boolean = false,
        public translations: any = {},
        public images: string[] = [],
    ) {
    }
}