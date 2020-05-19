import { useQuery } from "../../hooks/useQuery";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { get } from "../../config/axios";

export default function () {

    const [error, setError] = useState('');
    const resetCode = useQuery().get('passwordReset');
    const appContext = useContext(AppContext);

    useEffect(() => {
        if (resetCode) {
            get(`/resetpassword/${resetCode}`)
                .then(res => {
                    appContext.setUser(res.data);
                })
                .catch((err) => {
                    setError(`Error ${err.response.status}: ${err.response?.message || err}`)
                })
        }
    }, [resetCode])

    return { error }
}