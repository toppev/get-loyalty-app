import Business from "../models/business"
import User from "../models/user"
import fileService from "../services/fileService"
import StatusError from "../util/statusError"
import * as templateService from "./templateService"
import iconService from "./iconService"
import logger from "../util/logger"

export default {
  getOwnBusiness,
  getBusinessOwnerUser,
  createBusiness,
  getBusiness,
  update,
  setUserRole,
  getPublicInformation,
  getIcon,
  uploadIcon
}

/**
 * Get the id of the business the given user owns.
 *
 * @param user the user object (with customerData etc)
 * @return returns id of the first business found (only 1 business)
 * @deprecated Mainly for legacy stuff only.
 */
async function getOwnBusiness(user) {
  if (user.role === 'business') {
    return (await Business.findOne()).id
  }
}

/**
 * Get the user who owns the business
 */
async function getBusinessOwnerUser() {
  const owners = await User.find({ role: 'business' })
  if (owners.length === 0) {
    logger.warning(`No business owners found. Nobody registered?`)
  }
  if (owners.length > 1) {
    logger.warning(`More business owners than expected: ${owners.length}`)
  }
  return owners[0]
}

/**
 * Create a new business and promote its owner
 * @param {object} businessParam the business object to create with optional fields from {@link Business}
 * @param {any} userId the owner's _id field. This user will be given 'business' rank
 */
async function createBusiness(businessParam, userId) {
  if (await Business.countDocuments() > 0) {
    throw new StatusError('Business already exists', 403)
  }
  const business = new Business(businessParam)
  await business.save()
  await setUserRole(userId, 'business')
  if (process.env.NODE_ENV === 'test') {
    logger.info("Not loading default templates because NODE_ENV=test")
  } else {
    templateService.loadDefaultTemplates().then()
  }
  return business
}

/**
 * Find a business by its id
 */
async function getBusiness() {
  return Business.findOne().populate({
    path: 'public.customerLevels',
    populate: [{
      path: 'rewards.categories',
      model: 'Category',
    }, {
      path: 'rewards.products',
      model: 'Product',
    }]
  })
}

/**
 * Update an business. Does not replace the business, instead only updates the given fields.
 * @param {Object} updateParam the object whose fields will be copied to business.
 */
async function update(updateParam) {
  const business = await Business.findOne()
  Object.assign(business, updateParam)
  return business.save()
}

/**
 * Set the user's role in this business. Updates customerData of the user and returns an object with role and business's id:
 * @example {role: 'user', business: '5e38360f3afaeaff8581e78a'}
 *
 * @param {any} userId the user's _id field
 * @param role the role as a string
 */
async function setUserRole(userId, role) {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error(`User ${userId} was not found`)
  }
  user.role = role
  await user.save()
  // For legacy stuff return role and business separately too
  return {
    role: user.role,
    business: (await Business.findOne()).id,
    customerData: user.customerData
  }
}

/**
 * Get the public available information, anything in the business's ´public´ field
 */
async function getPublicInformation() {
  return Business.findOne().select('public config.userRegistration.dialogEnabled')
}

async function getIcon(size) {
  const fileNames = size ? [`icons/icon-${size}.png`, `icons/icon.png`, `icons/favicon.ico`] : [`icons/favicon.ico`]
  for (let fileName of fileNames) {
    const upload = await fileService.getUpload(fileName)
    if (upload?.data) {
      return upload
    }
  }
}

async function uploadIcon(icon) {
  const path = await fileService.upload('icons/icon.png', icon)
  await iconService.resizeToPNG(icon, [180, 192, 512], 'icons', 'icon')
  await iconService.generateFavicon(
    (await fileService.getUpload('icons/icon-192.png')).data,
    'icons/favicon.ico'
  )
  return { path }
}
