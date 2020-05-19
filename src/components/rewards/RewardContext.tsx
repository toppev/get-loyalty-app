import React from "react";
import Reward from "./Reward";

export interface RewardContextInterface {
    rewards: Reward[]
    addRewards: (rewards: Reward[]) => void,
    deleteReward: (reward: Reward) => void,
    updateReward: (reward: Reward) => void
}

export const defaultRewardContext: RewardContextInterface = {
    rewards: [new Reward('32131', 'Test Reward', "test reward description", "free items!")],
    addRewards: () => {
    },
    deleteReward: () => {
    },
    updateReward: () => {
    }
}

export default React.createContext<RewardContextInterface>(defaultRewardContext);