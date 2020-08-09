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
                    <p>{{name}}</p>
                    <p>{{description}}</p>
                    <p>{{itemDiscount}}</p>
                    <p>{{requirement}}</p>
                    <p>{{customerPoints}} {{translation.points.plural}}</p>
                    {{#each products}}
                        <span>{{name}}</span>
                    {{/each}}
                    {{#unless @last}},{{/unless}}
                    {{#each categories}}
                        <span>{{name}}</span>
                        {{#unless @last}},{{/unless}}
                    {{/each}}
                </div>
                {{/each}}
            </div>
            `
        ),
    });
}

export {
    userRewardsClass,
    addUserRewardsBlock
}