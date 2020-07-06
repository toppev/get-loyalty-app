import { BUSINESS_ID, get, multipartPost, patch, post } from "../config/axios";
import { Business } from "../context/AppContext";

function createBusiness(params?: any) {
    return post('/business/create', params);
}

function getBusiness(businessId: string) {
    return get(`/business/${businessId}`);
}

function updateBusiness(business: Business) {
    return patch(`/business/${BUSINESS_ID}`, business);
}

function setBusinessRole(userId: string, role: string) {
    return post(`/business/${BUSINESS_ID}/role`, { userId, role })
}

function getBusinessIcon() {
    return get(`/business/${BUSINESS_ID}/icon`)
}

function setBusinessIcon(icon: any) {
    const formData = new FormData()
    formData.append('file', icon)
    return multipartPost(`/business/${BUSINESS_ID}/icon`, formData)
}


export {
    getBusiness,
    createBusiness,
    updateBusiness,
    setBusinessRole,
    getBusinessIcon,
    setBusinessIcon,
}