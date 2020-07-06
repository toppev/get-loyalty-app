import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL
const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

// Used in requests. Easier if it's stored here instead of state
export let businessId = 'undefined'
const QUEUED: (() => any)[] = []

/**
 * Queue a function be called when we can send requests
 * (i.e ID of the business is known)
 */
function onReady(func: () => any) {
    QUEUED.push(func)
}

function setBusinessId(id: string) {
    businessId = id
    QUEUED.forEach(it => it())
    QUEUED.length = 0
}

/**
 * Returns "/business/:id"
 * For example,
 * /business/5ed26d9d9a3bf3a7eb7dd587
 * @param full whether to append BASE_URL as a prefix
 */
function getBusinessUrl(full?: boolean) {
    const pre = full ? BASE_URL : ''
    return `${pre}/business/${businessId}`
}

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
    getBusinessUrl,
    setBusinessId,
    BASE_URL,
    onReady
}