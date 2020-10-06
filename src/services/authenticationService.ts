import { get, post } from "../config/axios";
import { AppContextInterface } from "../context/AppContext";
import { createBusiness, getBusiness } from "./businessService";
import { AxiosResponse } from "axios";

type LoginCredentials = {
    email?: string,
    password?: string,
    /** Captcha token */
    token?: string
    /** Accept ToS/privacy policy etc (for registration) */
    acceptAll?: boolean
}

function loginRequest(data: LoginCredentials) {
    return post('/user/login', data);
}

function profileRequest() {
    return get('/user/profile');
}

function registerRequest(data: LoginCredentials) {
    return post('/user/register', data);
}

/**
 * Handles business stuff after the user logs in or creates a new account.
 * Either fetches the business or creates one and updates the context.
 */
function onLoginOrAccountCreate(context: AppContextInterface, res: AxiosResponse) {
    context.setUser(res.data)
    const setBusiness = (business: any) => {
        context.setBusiness(business);
    }
    const create = () => {
        createBusiness()
            .then(businessResponse => setBusiness(businessResponse.data))
            .catch(err => console.log(err))
    }
    // Either create or fetch the business (and if 404 then create)
    if (!res.data.businessOwner) {
        create();
    } else {
        getBusiness(res.data.businessOwner)
            .then(businessResponse => setBusiness(businessResponse.data))
            .catch(err => {
                console.log(err)
                if (err.response && err.response.status === 404) {
                    create();
                }
            })
    }
}

function logout() {
    return post('/user/logout', {})
}


export {
    profileRequest,
    loginRequest,
    registerRequest,
    onLoginOrAccountCreate,
    logout
}