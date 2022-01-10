class Page {

  _id: string
  name: string
  description: string
  stage: string
  icon: string
  pageIndex: number
  pathname: string
  template: boolean
  externalPage?: { url: string, urlType: string }
  gjs: any
  uploads: any[] | undefined

  constructor(data: any) {
    this._id = data._id || data.id
    this.name = data.name
    this.description = data.description
    this.stage = data.stage
    this.icon = data.icon
    this.pageIndex = data.pageIndex
    this.pathname = data.pathname
    this.externalPage = data.externalPage
    this.template = data.template
    this.gjs = data.gjs
    this.uploads = data.uploads
  }

  isPublished() {
    return this.stage === PUBLISHED
  }

  isDiscarded() {
    return this.stage === DISCARDED
  }

  discard() {
    this.stage = DISCARDED
  }

  getStageDisplayName() {
    if (this.stage === UNPUBLISHED) {
      return this.stage + " (hidden)"
    }
    return this.stage
  }
}

const UNPUBLISHED = 'unpublished'
const PUBLISHED = 'published'
const DISCARDED = 'discarded'

export { Page, UNPUBLISHED, PUBLISHED, DISCARDED }
