const PageData = require('../models/page')
const fileService = require('./fileService')
const juice = require('juice')
const pageScreenshot = require('./pageScreenshot')
const Business = require("../models/business")
const handlebars = require("handlebars")
const StatusError = require('../util/statusError')
const customerService = require('./customerService')
const campaignService = require('./campaignService')
const productService = require('./productService')
const scanService = require('./scanService')
const pollingService = require('./pollingService')
const { validateHandlebars } = require("../helpers/handlebars")
const logger = require("../util/logger")

module.exports = {
  createPage,
  savePage,
  loadPage,
  getBusinessPages,
  getPublicPage,
  uploadPage,
  uploadStaticFile,
  getThumbnail,
  getTemplates,
  renderPageView,
  getStaticFile
}

async function createPage(pageParam) {
  const business = await Business.findOne()
  const limit = business.plan.limits.pagesTotal
  if (limit !== -1 && await PageData.countDocuments({
    template: false,
    stage: { $ne: 'discarded' }
  }) >= limit) {
    throw new StatusError('Plan limit reached', 402)
  }
  const newPage = new PageData(pageParam)
  return newPage.save()
}

async function savePage(id, pageData, gjsOnly) {
  const oldPage = await PageData.findById(id)
  // Whether we save the entire document or just what's under 'gjs' key
  if (gjsOnly && gjsOnly !== 'false') {
    // In this case the pageData has gjs-components and gjs-style (root) keys (only what is under 'gjs').
    Object.assign(oldPage.gjs, pageData)
  } else {
    Object.assign(oldPage, pageData)
  }
  return oldPage.save()
}

async function loadPage(id, gjsOnly) {
  const page = await PageData.findById(id)
  // Whether we load the entire document or just what's under 'gjs' key
  if (gjsOnly && gjsOnly !== 'false') {
    return page.gjs
  }
  return page
}

/**
 * Find the given business's pages. The returned pages do not include the "gjs" data.
 * Returned pages include templates created by this server (for editing them).
 */
async function getBusinessPages() {
  return PageData.find({}).select('-gjs')
}

/**
 * Return only the ids of the published pages. First should be the home page.
 */
async function getPublicPage() {
  return PageData.find({
    stage: 'published',
  }).sort('pageIndex').select('_id icon pathname')
}

/**
 * Validates placeholders etc. Does css/html inlining or other stuff, queues a thumbnail screenshot.
 * So not exactly same as #uploadStaticFile.
 */
async function uploadPage(pageId, { html, css }) {
  if (!css) css = ""
  const res = await validateHandlebars(html)
  if (res.error) {
    throw new StatusError(`Invalid placeholders. ${res.error}`, 400)
  }
  // TODO: remove the inline CSS if possible
  //  Note that it looks ugly at the moment without it as the CSS loads after the page
  //  Find a solution to that. (Longer loading screen?)
  const tmpl = `${html}<style>${css}</style>`
  const inlineHtml = juice(tmpl)

  const dir = `page_${pageId}`
  await fileService.upload(dir + '/index.html', inlineHtml)
  await fileService.upload(dir + '/main.css', css)

  // Refresh the page for the page owner to automatically see changes
  await pollingService.refreshOwner({ message: '[Editor]\nChanges detected' })

  const page = await PageData.findById(pageId)
  if (page) {
    createScreenshot(pageId)
      .then(() => logger.info('Created or updated page thumbnail of', pageId))
      .catch(err => logger.error(`Failed to create a screenshot of ${pageId} page`, err))
  } else {
    logger.warning('Page with invalid ID was uploaded', pageId)
  }
}

async function createScreenshot(pageId) {
  const pagePath = `/page/${pageId}/html`
  const fileName = `page_${pageId}/screenshot.jpg`
  try {
    // TODO: Stop DDoSing our servers :(
    await pageScreenshot.takeScreenshot(pagePath, fileName)
  } catch (err) {
    if (err) {
      logger.error(`Failed to create a screenshot (${err.message})`, err)
    }
  }
  return fileName
}

async function getThumbnail(pageId) {
  const file = fileService.getUpload(`page_${pageId}/screenshot.jpg`)
  if (file?.data) {
    return file
  }
}

// IDEA: permission/plan based templates?
async function getTemplates() {
  return await PageData.find({ template: true })
}

async function getPageContext(user) {
  const business = await Business.findOne().lean()
  if (business) {
    //
    // Add all page placeholders somewhere below here
    //
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

    await customerService.populateUser(user)
    // FIXME: hacky, required for handlebar placeholders to work
    const userInfo = JSON.parse(JSON.stringify(await customerService.getCustomerInfo(user)))
    userInfo.rewards = (userInfo.customerData.rewards || []).map(reward => {
      return {
        scanCode: scanService.toScanCode(user, reward),
        ...reward,
      }
    })
    userInfo.usedRewards = userInfo.customerData.usedRewards.map(used => {
      return {
        ...used,
        // FIXME: used.dateUsed is string because of the JSON.parse(JSON.stringify(...))
        dateUsed: new Date(used.dateUsed).toLocaleDateString(undefined, dateOpts),
      }
    })

    const customerData = userInfo.customerData
    const products = (await productService.getAllProducts(true)).map(it => it.toObject())
    let campaigns = await campaignService.getAllCampaigns(true)
    campaigns = campaigns.map(rawCampaign => {
      const campaign = rawCampaign.toObject()
      // All customer stamps
      campaign.currentStampsAll = rawCampaign.getCurrentStamps(customerData)

      if (campaign.start) {
        campaign.start = campaign.start.toLocaleDateString(undefined, dateOpts)
      }
      if (campaign.end) {
        campaign.end = campaign.end.toLocaleDateString(undefined, dateOpts)
      }

      // Stamps needed to complete this campaign
      const stampsNeeded = Math.max(campaign.totalStampsNeeded - campaign.currentStampsAll.length, 0)
      campaign.stampsNeeded = Array.from({ length: stampsNeeded }, () => ({}))

      // The progress of completing the campaign, never more than totalStampsNeeded (e.g 9/10, 10/10 but not 11/10)
      campaign.customerProgress = campaign.currentStampsAll.slice(0, campaign.totalStampsNeeded)

      return campaign
    })
    const { config } = business
    const { translations } = config
    const points = customerData.properties.points
    userInfo.points = points // alias
    let customerLevels = business.public.customerLevels
    const currentLevel = customerService.getCurrentLevel(customerLevels, points)
    customerLevels = customerLevels
      .sort((a, b) => (a.requiredPoints || 0) - (b.requiredPoints || 0))
      .map(lvl => {
        if (currentLevel && lvl.name === currentLevel.name) {
          lvl.active = true
        }
        if (lvl.requiredPoints > points) {
          lvl.pointsNeeded = lvl.requiredPoints - points
        }
        return lvl
      })
    const nextLevel = customerLevels.find(lvl => lvl.requiredPoints > currentLevel.requiredPoints)

    return {
      user: userInfo,
      // Other information about rewards
      customerRewards: {
        unused: customerData.rewards.length,
        used: customerData.usedRewards.length,
      },
      birthdayGreeting: user.isBirthday ? business.config.translations.birthdayGreeting : undefined,
      business: business.public,
      customerLevels,
      currentLevel,
      nextLevel,
      products,
      campaigns,
      translations
    }
  }
}

async function renderPageView(pageId, user) {
  const upload = await fileService.getUpload(`page_${pageId}/index.html`)
  const pageHtml = upload?.data?.toString() || ""

  const context = await getPageContext(user)
  const template = handlebars.compile(pageHtml)
  // IDEA: should we cache the compiled html based on the context or user/page
  return template(context)
}

async function uploadStaticFile(pageId, jsCode, fileName) {
  validateStaticFileName(fileName)
  const dir = `page_${pageId}/`
  await fileService.upload(dir + fileName, jsCode)
  // Refresh the page for the page owner to automatically see changes
  await pollingService.refreshOwner({ message: '[Editor]\nChanges detected' })
}

async function getStaticFile(pageId, fileName) {
  validateStaticFileName(fileName)
  const dir = `page_${pageId}`
  const upload = await fileService.getUpload(dir + '/' + fileName)
  return upload
}

function validateStaticFileName(fileName) {
  // Just to be sure it's safe for now
  if (!['main.js', 'index.html', 'main.css'].includes(fileName)) {
    throw new StatusError(`Unsupported static file: ${fileName}`, 403)
  }
}
