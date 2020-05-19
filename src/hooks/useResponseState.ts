import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AxiosResponse } from "axios";

/**
 * Hook that will set the state to the response.data if it exists
 * @param response the response whose data to read
 * @param initialState initial state (e.g empty array)
 */
export default function useResponseState<T>(
    response: AxiosResponse<any> | undefined,
    initialState: T
): [T, Dispatch<SetStateAction<T>>] {

    const [state, setState] = useState<T>(initialState);

    useEffect(() => {
        if (response) {
            // TODO: better type check?
            setState(response.data)
        }
    }, [response])

    return [
        state,
        setState
    ]

}