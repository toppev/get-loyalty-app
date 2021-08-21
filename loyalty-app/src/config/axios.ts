import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_URL

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

export default client

export {
  BASE_URL
}
