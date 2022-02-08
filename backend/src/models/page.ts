import mongoose, { Document, Schema } from "mongoose"

const UNNAMED_PAGE = 'unnamed'

export interface IPage {
  id?: any
  name: string
  pathname: string
  description: string
  stage: 'unpublished' | 'published' | 'discarded'
  template: boolean
  fromTemplate: Schema.Types.ObjectId
  /** HTML */
  icon: string
  externalPage: {
    url: string
    urlType: null | 'iframe' | 'external_link'
  }
  pageIndex: number
  gjs: {
    "gjs-components": string
    "gjs-styles": string
  }
}

export interface PageDocument extends IPage, Document {
}

const PageDataSchema = new Schema<PageDocument>({
  name: {
    type: String
  },
  pathname: {
    type: String,
    default: UNNAMED_PAGE
  },
  // Mainly just for the templates
  description: {
    type: String
  },
  // We don't delete pages currently
  // Instead just make them invisible
  stage: {
    type: String,
    enum: ['unpublished', 'published', 'discarded'],
    default: 'unpublished'
  },
  template: {
    type: Boolean,
    default: false
  },
  fromTemplate: {
    type: Schema.Types.ObjectId,
  },
  // the html icon of this page
  icon: {
    type: String
  },
  // Optional url for external pages
  // e.g if the business already has a page, they can use it
  externalPage: {
    url: {
      type: String,
    },
    urlType: {
      type: String,
      enum: [null, 'iframe', 'external_link'],
    },
  },
  pageIndex: {
    type: Number,
  },
  gjs: {
    "gjs-components": {
      type: String
    },
    "gjs-styles": {
      type: String
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

PageDataSchema.pre('save', async function () {
  // Lazy loading
  let pagesCount
  const getPagesCount = async () => pagesCount === undefined ? pagesCount = await PageData.countDocuments({ template: false }) : pagesCount

  if (!this.pathname || this.pathname === UNNAMED_PAGE) {
    this.pathname = `page${await getPagesCount()}`
  }
  if (this.pathname.startsWith('/')) {
    this.pathname = this.pathname.substring(1)
  }
  if (this.pageIndex === undefined || this.pageIndex === null) {
    this.pageIndex = await getPagesCount()
  }
})

const PageData = mongoose.model<PageDocument>('PageData', PageDataSchema)
export default PageData
