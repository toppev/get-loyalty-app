import { get, post } from "../config/axios";

type LoginCredentials = {
    email?: string
    password?: string
}

function profileRequest() {
    return get('/user/profile')
}

/**
 * @deprecated TODO: replace with ifram form
 */
function registerRequest({ email, password }: LoginCredentials = {}) {
    return post('/user/register', { email, password })
}

export {
    profileRequest,
    registerRequest,
}