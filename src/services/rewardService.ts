import { get } from "../config/axios";

async function listRewards() {
    return get(`/business/reward/list`);
}

export {
    listRewards
}