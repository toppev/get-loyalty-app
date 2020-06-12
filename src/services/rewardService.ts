import { BUSINESS_ID, get } from "../config/axios";

async function listRewards() {
    return get(`/business/${BUSINESS_ID}/reward/list`);
}

export {
    listRewards
}