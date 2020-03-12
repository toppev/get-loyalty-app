import axios from "axios";


export const BASE_URL = 'http://localhost:3001';

const headers = {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
}

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
        data: data,
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