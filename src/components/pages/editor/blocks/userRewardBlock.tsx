import React from "react";

const userRewardsClass = "loyally-user-rewards"
const userRewardItemClass = "loyally-user-reward"

/**
 * Block to list user rewards
 */
function addUserRewardsBlocK(blockManager: any) {
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
    addUserRewardsBlocK
}