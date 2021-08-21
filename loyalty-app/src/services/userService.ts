import client from "../config/axios"

type LoginCredentials = {
  email?: string
  password?: string
}

function loginRequest({ email, password }: LoginCredentials = {}) {
  return client.post('/user/login', { email, password })
}

function profileRequest() {
  return client.get('/user/profile')
}

function registerRequest({ email, password }: LoginCredentials = {}) {
  return client.post('/user/register', { email, password })
}

function updateUser(userId: string, user: any) {
  return client.patch(`/user/${userId}`, user)
}

function deleteProfile(userId: string) {
  return client.delete(`/user/${userId}`)
}

export {
  loginRequest,
  profileRequest,
  registerRequest,
  updateUser,
  deleteProfile
}
