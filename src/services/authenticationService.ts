import { businessId, get, post } from "../config/axios";

type LoginCredentials = {
    email?: string
    password?: string
}

function loginRequest({ email, password }: LoginCredentials = {}) {
    return post('/user/login', { email, password })
}

function profileRequest() {
    return get('/user/profile')
}

function registerRequest({ email, password }: LoginCredentials = {}) {
    return post('/user/register', { email, password })
}

function getBusinessId() {
    if (businessId?.length === 24) {
        return businessId
    }
    return get(`/business/whois/?url=${document.location.href}`)
}


export {
    profileRequest,
    loginRequest,
    registerRequest,
    getBusinessId
}