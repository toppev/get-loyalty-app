import axios from "axios";

//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
//axios.defaults.withCredentials = true // TODO: only for testing


export const BASE_URL = '';
export const BUSINESS_ID = 'fakebusinessid';

const headers = {}

/*

axios.interceptors.response.use(response => {
   return response;
}, error => {
  if (error.response.status === 401) {
   // login
  }
  return error;
});

*/

export async function get(path: string, fullPath: boolean = false) {

    return axios({
        method: 'GET',
        url: fullPath ? path : BASE_URL + path,
        headers: headers
    });
}

/**
 * Delete, just renamed to remove
 */
export async function remove(path: string, fullPath: boolean = false) {
    return axios({
        method: 'DELETE',
        url: fullPath ? path : BASE_URL + path,
        headers: headers
    });
}

export async function post(path: string, data: Object, fullPath: boolean = false) {
    return axios({
        method: 'POST',
        url: fullPath ? path : BASE_URL + path,
        data: transformDataObjects(data),
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

export async function patch(path: string, data: Object, fullPath: boolean = false) {
    return axios({
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
    return axios({
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
    if (data.toRequestObject) {
        return data.toRequestObject();
    }
    if (Array.isArray(data)) {
        return data.map(item => item.toRequestObject ? item.toRequestObject() : item);
    }
    return data;
}