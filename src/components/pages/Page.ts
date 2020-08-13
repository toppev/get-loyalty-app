class Page {

    _id: string
    name: string
    description: string
    stage: string
    icon: string
    pageIndex: number
    pathname: string
    externalURL?: string

    constructor(data: any) {
        this._id = data._id || data.id;
        this.name = data.name;
        this.description = data.description;
        this.stage = data.stage;
        this.icon = data.icon;
        this.pageIndex = data.pageIndex;
        this.pathname = data.pathname;
        this.externalURL = data.externalURL;
    }

    isPublished() {
        return this.stage === PUBLISHED;
    }

    isDiscarded() {
        return this.stage === DISCARDED;
    }

    discard() {
        this.stage = DISCARDED;
    }
}

const UNPUBLISHED = 'unpublished'
const PUBLISHED = 'published'
const DISCARDED = 'discarded'

export { Page, UNPUBLISHED, PUBLISHED, DISCARDED }