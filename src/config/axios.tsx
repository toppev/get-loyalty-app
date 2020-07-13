import axios from "axios";

// export const SERVER_API_URL = 'https://api.getloyalty.app/server';
export const SERVER_API_URL = 'http://localhost:8080/server';

// export let API_URL = 'http://localhost:3001';
export let API_URL = 'invalid_url_should_not_be_used';

export function setAPI_URL(url: string) {
    API_URL = url
}

export const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

const headers = {}

export async function get(path: string, fullPath: boolean = false) {
    return instance({
        method: 'GET',
        url: fullPath ? path : API_URL + path,
        headers: headers
    });
}

/**
 * Delete, just renamed to remove
 */
export async function remove(path: string, fullPath: boolean = false) {
    return instance({
        method: 'DELETE',
        url: fullPath ? path : API_URL + path,
        headers: headers
    });
}

export async function post(path: string, data: Object, fullPath: boolean = false) {
    return instance({
        method: 'POST',
        url: fullPath ? path : API_URL + path,
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
        url: fullPath ? path : API_URL + path,
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
        url: fullPath ? path : API_URL + path,
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
        url: fullPath ? path : API_URL + path,
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