import { useQuery } from "../../hooks/useQuery";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { get } from "../../config/axios";
import { AxiosResponse } from "axios";


export default function (callback?: (res: AxiosResponse) => any, onError?: (err: any) => any) {

    const resetCode = useQuery().get('passwordReset');

    useEffect(() => {
        if (resetCode) {
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
    }, [resetCode])

}