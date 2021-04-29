import { get, patch, post, remove } from "../config/axios";
import Reward from "../components/rewards/Reward";
import Customer from "../components/customers/Customer";

function listCustomers(search?: string) {
  let subUrl = `/business/customers`;
  if (search) {
    subUrl += `?search=${search}`;
  }
  return get(subUrl);
}

function loadCustomer(customerId: string) {
  return get(`/customer/${customerId}`)
}

function updateCustomerProperties(customer: Customer) {
  return patch(`/customer/${customer.id}/properties`, customer.customerData.properties);
}

function revokeCustomerReward(customer: Customer, reward: Reward) {
  return remove(`/customer/${customer.id}/reward/${reward.id}`);
}

function updateCustomerReward(customer: Customer, updatedRewards: Reward[]) {
  return post(`/customer/${customer.id}/rewards`, updatedRewards);
}

function addCustomerReward(customer: Customer, reward: Reward) {
  return post(`/customer/${customer.id}/reward`, reward);
}

function rewardAllCustomers(reward: Reward) {
  return post(`/business/reward/all`, reward);
}

export {
  loadCustomer,
  updateCustomerProperties,
  listCustomers,
  addCustomerReward,
  revokeCustomerReward,
  updateCustomerReward,
  rewardAllCustomers
};
