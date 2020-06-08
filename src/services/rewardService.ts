import { get, getBusinessUrl } from "../config/axios";

async function listRewards() {
    return get(`${getBusinessUrl()}/reward/list`);
}

export {
    listRewards
}