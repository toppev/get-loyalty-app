import axios from "axios";

const BASE_URL = '';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Used in requests. Easier if it's stored here instead of state
let BUSINESS_ID: string;
const headers = {}

function setBusinessId(id: string) {
    BUSINESS_ID = id;
}

/**
 * Returns BASE_URL/business/:id
 * For example,
 * http://localhost:3000/business/5ed26d9d9a3bf3a7eb7dd587
 */
function getBusinessUrl() {
    return `${BASE_URL}/business/${BUSINESS_ID}`;
}

async function get(path: string, fullPath = false) {
    return instance({
        method: 'GET',
        url: fullPath ? path : BASE_URL + path,
        headers: headers
    });
}

async function post(path: string, data: any, fullPath = false) {
    return instance({
        method: 'POST',
        url: fullPath ? path : BASE_URL + path,
        data: transformDataObjects(data),
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

async function patch(path: string, data: any, fullPath = false) {
    return instance({
        method: 'PATCH',
        url: fullPath ? path : BASE_URL + path,
        data: transformDataObjects(data),
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}


/**
 * Add toRequestObject if you want to serialize a different version of the object.
 * E.g full objects to ObjectId references only
 */
function transformDataObjects(data: any) {
    if (data?.toRequestObject) {
        return data.toRequestObject();
    }
    if (Array.isArray(data)) {
        return data.map(item => item.toRequestObject ? item.toRequestObject() : item);
    }
    return data;
}

export {
    post,
    get,
    patch,
    getBusinessUrl,
    setBusinessId,
    BASE_URL,
}