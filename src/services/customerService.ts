import { BUSINESS_ID, get, patch } from "../config/axios";
import Reward from "../components/rewards/Reward";
import Customer from "../components/customers/Customer";

function listCustomers(search?: string) {
    let subUrl = `/business/${BUSINESS_ID}/customers`;
    if (search) {
        subUrl += `?search=${search}`;
    }
    return get(subUrl);
}

function updateCustomer(customer: Customer) {
    const subUrl = `/business/${BUSINESS_ID}/customer`;
    return patch(`${subUrl}/${customer._id}`, customer);
}

function loadCustomer(customerId: string) {
    const subUrl = `/business/${BUSINESS_ID}/customer`;
    return get(`${subUrl}/${customerId}`)
}

function revokeCustomerReward(customer: Customer, reward: Reward) {
    customer.customerData.rewards = customer.customerData.rewards.filter(r => r._id !== reward._id);
    return updateCustomer(customer)
}

function updateCustomerReward(customer: Customer, updatedReward: Reward) {
    customer.customerData.rewards = customer.customerData.rewards.map(r => r._id === updatedReward._id ? updatedReward : r);
    return updateCustomer(customer)
}

function addCustomerReward(customer: Customer, reward: Reward) {
    if (reward) {
        customer.customerData.rewards.push(reward);
    }
    return updateCustomer(customer)
}

export {
    loadCustomer,
    updateCustomer,
    listCustomers,
    addCustomerReward,
    revokeCustomerReward,
    updateCustomerReward
};