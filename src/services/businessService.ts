import { BUSINESS_ID, get, patch, post } from "../config/axios";
import { Business } from "../context/AppContext";

async function createBusiness(params?: any) {
    return post('/business/create', params);
}

async function getBusiness() {
    // TODO
    return get('/TODO');
}

async function updateBusiness(business: Business) {
    return patch(`/business/${business._id}`, business);
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