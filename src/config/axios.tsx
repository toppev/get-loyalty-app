import axios from "axios";


export const BASE_URL = 'http://localhost:3001';
// Where the PWA is hosted
export const APP_URL = 'http://localhost:3002';
//export const APP_URL = 'https://pwa.getloyalty.app';

export const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Used in requests. Easier if it's stored here instead of state
export let BUSINESS_ID: string;

const headers = {}

export async function get(path: string, fullPath: boolean = false) {
    return instance({
        method: 'GET',
        url: fullPath ? path : BASE_URL + path,
        headers: headers
    });
}

/**
 * Delete, just renamed to remove
 */
export async function remove(path: string, fullPath: boolean = false) {
    return instance({
        method: 'DELETE',
        url: fullPath ? path : BASE_URL + path,
        headers: headers
    });
}

export async function post(path: string, data: Object, fullPath: boolean = false) {
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

export async function multipartPost(path: string, data: Object, fullPath: boolean = false) {
    return instance({
        method: 'POST',
        url: fullPath ? path : BASE_URL + path,
        data: transformDataObjects(data),
        headers: {
            'Content-Type': 'multipart/form-data',
            ...headers
        }
    });
}

export async function patch(path: string, data: Object, fullPath: boolean = false) {
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

export async function uploadFile(path: string, file: File, fullPath: boolean = false) {
    const formData = new FormData();
    formData.append('file', file)
    return instance({
        method: 'POST',
        url: fullPath ? path : BASE_URL + path,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
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