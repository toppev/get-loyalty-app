import { deleteRequest, get, patch, post } from "../config/axios";

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

function updateUser(userId: string, user: any) {
    return patch(`/user/${userId}`, user)
}

function deleteProfile(userId: string) {
    return deleteRequest(`/user/${userId}`)
}

export {
    loginRequest,
    profileRequest,
    registerRequest,
    updateUser,
    deleteProfile
}