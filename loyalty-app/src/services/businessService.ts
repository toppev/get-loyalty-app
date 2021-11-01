import client from "../config/axios"

async function getBusiness() {
  return client.get(`/business`)
}

export {
  getBusiness
}
