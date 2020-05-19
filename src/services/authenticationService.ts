import { post } from "../config/axios";

type LoginCredentials = {
    email?: string,
    password?: string,
}

function loginRequest({ email, password }: LoginCredentials = {}) {
    return post('/user/login', { email, password });
}


function registerRequest({ email, password }: LoginCredentials = {}) {
    return post('/user/register', { email, password });
}


export {
    loginRequest,
    registerRequest
}