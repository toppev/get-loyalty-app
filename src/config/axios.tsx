import axios from "axios";

/** Public/Shared API */
export const API_URL = 'https://api.getloyalty.app/v1';
export const SERVER_API_URL = `${API_URL}/servers`;

/** The current server instances URL */
export let backendURL = window.localStorage.getItem('API_URL')
    || (process.env.NODE_ENV === "development" && 'http://localhost:3001')
    || 'https://invalid_url_should_not_be_used.adadawda';

export function setBackendUrl(url: string) {
    backendURL = url
    window.localStorage.setItem('API_URL', url)
}

export function validBackendURL() {
    return !backendURL.includes('invalid_url')
}

export const instance = axios.create({
    baseURL: backendURL,
    withCredentials: true,
});

const headers = {}

export async function get(path: string, fullPath: boolean = false) {
    return instance({
        method: 'GET',
        url: fullPath ? path : backendURL + path,
        headers: headers
    });
}

/**
 * Delete, just renamed to remove
 */
export async function remove(path: string, fullPath: boolean = false) {
    return instance({
        method: 'DELETE',
        url: fullPath ? path : backendURL + path,
        headers: headers
    });
}

export async function post(path: string, data: Object, fullPath: boolean = false) {
    return instance({
        method: 'POST',
        url: fullPath ? path : backendURL + path,
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
        url: fullPath ? path : backendURL + path,
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
        url: fullPath ? path : backendURL + path,
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
        url: fullPath ? path : backendURL + path,
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