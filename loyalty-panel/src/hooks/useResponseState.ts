import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AxiosResponse } from "axios";

/**
 * Hook that will set the state to the response.data if it exists
 * @param response the response whose data to read
 * @param initialState initial state (e.g empty array)
 * @param parser optional custom request parser. Function that takes the response and returns T
 */
export default function useResponseState<T>(
  response: AxiosResponse | undefined,
  initialState: T,
  parser?: (response: AxiosResponse) => T
): [T, Dispatch<SetStateAction<T>>] {

  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    if (response) {
      // TODO: better type check?
      setState(parser ? parser(response) : response.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  return [
    state,
    setState
  ]

}
