import axios from "axios";
import { BUSINESS_ID } from "./businessConfig"

const BASE_URL = 'http://localhost:3001';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Used in requests. Easier if it's stored here instead of state
export let businessId = BUSINESS_ID || 'undefined';
const headers = {}

function setBusinessId(id: string) {
    businessId = id;
}

/**
 * Returns BASE_URL/business/:id
 * For example,
 * http://localhost:3000/business/5ed26d9d9a3bf3a7eb7dd587
 */
function getBusinessUrl() {
    return `/business/${businessId}`;
}

async function get(path: string) {
    return instance({
        method: 'GET',
        url: BASE_URL + path,
        headers: headers
    });
}

async function post(path: string, data: any) {
    return instance({
        method: 'POST',
        url: BASE_URL + path,
        data: data,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

async function patch(path: string, data: any) {
    return instance({
        method: 'PATCH',
        url: BASE_URL + path,
        data: data,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

export {
    post,
    get,
    patch,
    getBusinessUrl,
    setBusinessId,
    BASE_URL,
}