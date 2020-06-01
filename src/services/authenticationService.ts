import { get, post } from "../config/axios";

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


export {
    profileRequest,
    loginRequest,
    registerRequest,
}