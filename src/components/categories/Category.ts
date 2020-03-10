export default class Category {
    name!: string
    parents: string[] = []
    children: string[] = []
    keywords: string[] = []
    official: boolean = false
    translations: any = {}
    images: string[] = []

    constructor(name: string) {
        this.name = name;
    }
}