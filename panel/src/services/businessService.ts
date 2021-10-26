import { get, multipartPost, patch, post } from "../config/axios"
import { Business } from "../context/AppContext"

function createBusiness(params?: any) {
  return post('/business/create', params)
}

function getBusiness(businessId: string) {
  return get(`/business`)
}

function updateBusiness(business: Business) {
  return patch(`/business`, business)
}

function setBusinessRole(userId: string, role: string) {
  return post(`/business/role`, { userId, role })
}

function getBusinessIcon() {
  return get(`/business/icon`)
}

function setBusinessIcon(icon: any) {
  const formData = new FormData()
  formData.append('file', icon)
  return multipartPost(`/business/icon`, formData)
}


export {
  getBusiness,
  createBusiness,
  updateBusiness,
  setBusinessRole,
  getBusinessIcon,
  setBusinessIcon,
}
