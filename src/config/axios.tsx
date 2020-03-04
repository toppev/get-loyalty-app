import axios from "axios";


const url = 'http://localhost:3001';

const defaultHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
};

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

export async function get(path: String) {

    return axios({
        method: 'GET',
        url: url + path,
        headers: defaultHeader
    });
}

export async function remove(path: String) {
    return axios({
        method: 'DELETE',
        url: url + path,
        headers: defaultHeader
    });
}

export async function post(path: String, data: Object) {
    return axios({
        method: 'POST',
        url: url + path,
        headers: defaultHeader
    });
}

export async function patch(path: String, data: Object) {
    return axios({
        method: 'PATCH',
        url: url + path,
        headers: defaultHeader
    });
}

export async function uploadFile(path: String, file: File) {
    const formData = new FormData();
    formData.append('file', file)
    return axios({
        method: 'POST',
        url: url + path,
        headers: {
            'content-type': 'multipart/form-data',
            headers: defaultHeader
        }
    });
}