import { patch } from "../config/axios"

async function updateUser(userId: string, user: any) {
  return patch(`/user/${userId}`, user)
}

export {
  updateUser
}
