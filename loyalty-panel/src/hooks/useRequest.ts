import { useCallback, useEffect, useState } from "react"
import RequestError from "../util/requestError"
import { AxiosResponse } from "axios"

type Request = () => Promise<any>
type Callback = (response: AxiosResponse) => any
type OnError = (err: any) => any

type RequestWithCallback = {
  request?: Request
  callback?: Callback
  onError?: OnError
}

/**
 * Hook to easily perform axios request with possibility to retry on error
 *
 * @param initialRequest the function to execute
 * @param options optional options
 * @param initialCallback the callback function for initialRequest
 */
export default function useRequest(
  initialRequest?: Request,
  options?: {
    /**
     * Whether to perform on first render. Defaults to true if initialRequest is set, otherwise false
     */
    performInitially?: boolean,
    /**
     * Whether to perform perform every time the request or options change. Defaults to true
     */
    performAutomatically?: boolean,
    /**
     * Custom error message to display if an error occurs
     */
    errorMessage?: string,
    onError?: OnError
  },
  initialCallback?: Callback,
) {

  // Options to use
  const opts = {
    performInitially: !!initialRequest,
    performAutomatically: true,
    errorMessage: "Failed to perform a request",
    ...{ options },
  }

  const [requestContext, setRequestContext] = useState<RequestWithCallback>({
    request: initialRequest,
    callback: initialCallback,
    onError: opts.options?.onError
  })

  const [loading, setLoading] = useState<undefined | boolean>(undefined)
  const [error, setError] = useState<RequestError | undefined>()
  const [response, setResponse] = useState<AxiosResponse | undefined>()

  const execute = useCallback(() => {
    if (requestContext.request) {
      setLoading(true)
      requestContext.request()
        .then((res: AxiosResponse) => {
          setResponse(res)
          requestContext.callback && requestContext.callback(res)
        })
        .catch((err: any) => {
          console.error(err)
          setError({
            message: opts.errorMessage || parseError(err),
            error: err,
            retry: canRetry(err) ? () => execute() : undefined,
            clearError: () => setError(undefined)
          })
          requestContext.onError && requestContext.onError(err)
        }).finally(() => setLoading(false))
    }
  }, [opts.errorMessage, requestContext])

  useEffect(() => {
    if (opts?.performAutomatically || (opts?.performInitially && loading === undefined))
      execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute])

  const performRequest = useCallback((request: Request, callback?: Callback, onError?: OnError) => {
    setError(undefined)
    setRequestContext({ request, callback, onError })
  }, [])

  return {
    loading,
    error: error,
    response,
    execute,
    performRequest
  }

}

function canRetry(err: any) {
  // Do not allow retrying with invalid body/fields
  return err?.response?.status !== 400
}

function parseError(err: any) {
  const data = err?.response?.data
  if (Array.isArray(data)) {
    return data.join(', ')
  }
  if (Array.isArray(data?.message)) {
    return data.message.join(', ')
  }
  if (data?.message) {
    return data.message
  }
  return err.response?.statusText
}
