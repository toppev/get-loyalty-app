import { useQuery } from "../../hooks/useQuery";
import { useEffect } from "react";
import { get, setBackendUrl } from "../../config/axios";
import { AxiosResponse } from "axios";
import { profileRequest } from "../../services/authenticationService";


export default function (callback?: (res: AxiosResponse) => any, onError?: (err: any) => any) {

    const resetCode = useQuery().get('passwordReset');
    // To easily "login" if we know the API address
    const API_ADDRESS = useQuery().get('api_address');

    useEffect(() => {
        if (API_ADDRESS) {
            setBackendUrl(API_ADDRESS)
            profileRequest().then(callback)
        } else if (resetCode) {
            get(`/resetpassword/${resetCode}`)
                .then(res => {
                    if (callback) {
                        callback(res);
                    }
                })
                .catch((err) => {
                    // setError(`Error ${err.response.status}: ${err.response?.message || err}`)
                    if (onError) {
                        onError(err);
                    }
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetCode, API_ADDRESS])

}