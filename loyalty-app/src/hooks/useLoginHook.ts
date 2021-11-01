import { useEffect, useState } from "react"
import { profileRequest, registerRequest } from "../services/userService"
import { AxiosResponse } from "axios"

export interface LoginData {
  isRegistration: boolean
}

type LoginHookParams = {
  onLogin: (res: AxiosResponse, data: LoginData) => any
}

export function useLoginHook({ onLogin }: LoginHookParams) {

  const [error, setError] = useState<string | undefined>()

  // Authentication
  useEffect(() => {
    profileRequest()
      .then(res => onLogin(res, { isRegistration: false }))
      .catch(err => {
        // TODO: Option to login on other responses?
        const status = err?.response?.status
        if (status === 401 || status === 403 || status === 404) {
          registerRequest()
            .then(res => onLogin(res, { isRegistration: true }))
            .catch(_err => setError('Could not register a new account. Something went wrong :('))
        } else {
          setError(`Something went wrong :(\n${err.response?.body || err.toString()}`)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    error,
    setError
  }

}
