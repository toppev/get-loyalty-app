class Page {

    _id: string
    name: string
    description: string
    stage: string
    icon: string

    constructor(data: any) {
        this._id = data._id;
        this.name = data.name;
        this.description = data.description;
        this.stage = data.stage;
        this.icon = data.icon;
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

const EMPTY_PAGE = new Page({ _id: '', name: '', icon: '<p>icon</p>' })

export { Page, EMPTY_PAGE, UNPUBLISHED, PUBLISHED, DISCARDED }