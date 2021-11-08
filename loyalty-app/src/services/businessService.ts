import client from "../config/axios"

async function getBusinessPublic() {
  return client.get(`/business/public`)
}

async function isRegistrationFormEnabled(){
  const res = await getBusinessPublic()
  return Boolean(res.data.config.userRegistration.dialogEnabled)
}

export {
  isRegistrationFormEnabled
}
