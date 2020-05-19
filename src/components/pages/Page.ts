class Page {

    _id: string;
    name: string;
    description: string;
    stage: string;

    constructor(id: string, name: string, description: string = "", stage: string = UNPUBLISHED) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.stage = stage;
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
const DISCARDED = 'published'

const EMPTY_PAGE = new Page('', '')

export { Page, EMPTY_PAGE, UNPUBLISHED, PUBLISHED, DISCARDED }