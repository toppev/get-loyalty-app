import { BUSINESS_ID, get, patch, post } from "../config/axios";
import { Business } from "../context/AppContext";

async function createBusiness(params?: any) {
    return post('/business/create', params);
}

async function getBusiness(businessId: string) {
    return get(`/business/${businessId}`);
}

async function updateBusiness(business: Business) {
    return patch(`/business/${BUSINESS_ID}`, business);
}

async function setBusinessRole(userId: string, role: string) {
    return post(`/business/${BUSINESS_ID}/role`, { userId, role })
}

async function listBusinessCustomers(limit: number) {
    return get(`/business${BUSINESS_ID}/customers?limit=${limit || 10}`)
}

export {
    getBusiness,
    createBusiness,
    updateBusiness,
    setBusinessRole,
    listBusinessCustomers
}