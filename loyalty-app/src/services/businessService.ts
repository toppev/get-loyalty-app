import client from "../config/axios"

async function getBusinessPublic() {
  return client.get(`/business/public`)
}

export {
  getBusinessPublic
}
