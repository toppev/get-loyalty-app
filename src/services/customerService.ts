import { BUSINESS_ID, get, patch, post, remove } from "../config/axios";
import Reward from "../components/rewards/Reward";
import Customer from "../components/customers/Customer";

function listCustomers(search?: string) {
    let subUrl = `/business/${BUSINESS_ID}/customers`;
    if (search) {
        subUrl += `?search=${search}`;
    }
    return get(subUrl);
}

function loadCustomer(customerId: string) {
    const subUrl = `/business/${BUSINESS_ID}/customer`;
    return get(`${subUrl}/${customerId}`)
}

function updateCustomerProperties(customer: Customer) {
    const subUrl = `/business/${BUSINESS_ID}/customer`;
    return patch(`${subUrl}/${customer.id}/properties`, customer.customerData.properties);
}

function revokeCustomerReward(customer: Customer, reward: Reward) {
    const subUrl = `/business/${BUSINESS_ID}/customer`;
    return remove(`${subUrl}/${customer.id}/reward/${reward.id}`);
}

function updateCustomerReward(customer: Customer, updatedRewards: Reward[]) {
    const subUrl = `/business/${BUSINESS_ID}/customer`;
    return post(`${subUrl}/${customer.id}/rewards`, updatedRewards);
}

function addCustomerReward(customer: Customer, reward: Reward) {
    const subUrl = `/business/${BUSINESS_ID}/customer`;
    return post(`${subUrl}/${customer.id}/reward`, reward);
}

export {
    loadCustomer,
    updateCustomerProperties,
    listCustomers,
    addCustomerReward,
    revokeCustomerReward,
    updateCustomerReward
};