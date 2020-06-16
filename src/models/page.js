const mongoose = require('mongoose');
const { Schema } = mongoose;

const UNNAMED_PAGE = 'unnamed'

const PageDataSchema = new Schema({
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
    business: {
        type: mongoose.Types.ObjectId,
        ref: 'Business',
        index: true
    },
    // We don't delete pages currently
    // Instead just make them invisible
    stage: {
        type: String,
        enum: ['unpublished', 'published', 'discarded'],
        default: 'unpublished'
    },
    template: {
        type: Boolean
    },
    // html icon
    icon: {
        type: String
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

PageDataSchema.pre('save', async function () {
    // Lazy loading
    let pagesCount;
    const getPagesCount = async () => pagesCount === undefined ? pagesCount = await PageData.countDocuments({ business: this.business }) : pagesCount

    if (!this.pathname || this.pathname === UNNAMED_PAGE) {
        this.pathname = `page${await getPagesCount()}`;
    }
    if (this.pathname.startsWith('/')) {
        this.pathname = this.pathname.substring(1)
    }
    if (!this.pageIndex) {
        this.pageIndex = await getPagesCount();
    }
})

const PageData = mongoose.model('PageData', PageDataSchema);
module.exports = PageData;