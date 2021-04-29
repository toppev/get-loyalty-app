import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

async function get(path: string, fullPath?: boolean) {
  return instance({
    method: 'GET',
    url: fullPath ? path : BASE_URL + path,
  })
}

async function deleteRequest(path: string, fullPath?: boolean) {
  return instance({
    method: 'DELETE',
    url: fullPath ? path : BASE_URL + path,
  })
}

async function post(path: string, data: any, fullPath?: boolean) {
  return instance({
    method: 'POST',
    url: fullPath ? path : BASE_URL + path,
    data: data,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

async function patch(path: string, data: any, fullPath?: boolean) {
  return instance({
    method: 'PATCH',
    url: fullPath ? path : BASE_URL + path,
    data: data,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export {
  post,
  get,
  patch,
  deleteRequest,
  BASE_URL,
}
