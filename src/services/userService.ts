import { patch } from "../config/axios";
import { User } from "../context/AppContext";

async function updateUser(userId: string, user: any) {
    return patch(`/user/${userId}`, user);
}

export {
    updateUser
}