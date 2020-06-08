import React from "react";

const userRewardsClass = "loyalty-user-rewards"
const userRewardItemClass = "loyalty-user-reward"

/**
 * Block to list user rewards
 */
function addUserRewardsBlock(blockManager: any) {
    blockManager.add(userRewardsClass, {
        label: `User Rewards`,
        content: (`
            <div class="${userRewardsClass}">
                {{#each user.rewards}}
                <div class="${userRewardItemClass}">
                    {{name}}
                    // TODO
                </div>
            </div>
            `
        ),
    });
}

export {
    userRewardsClass,
    addUserRewardsBlock
}