import { DATA_IDENTIFIER, loyaltyQRCode } from "./qrCodeBlock";

const userRewardsClass = "loyalty-user-rewards"
const userRewardItemClass = "loyalty-user-reward"

/**
 * Block to list user rewards
 */
function addUserRewardsBlock(blockManager: any) {
  blockManager.add(userRewardsClass, {
    label: `User Rewards`,
    content: (`
            <div class="${userRewardsClass}" style="text-align: center">
                <h2>Rewards {{user.rewards.length}}</h2>
                <p>{{#each user.rewards}}</p>
                <div class="${userRewardItemClass}">
                    <p>{{name}}</p>

                    <div data-gjs-type="${loyaltyQRCode}" ${DATA_IDENTIFIER}="{{scanCode}}"/>

                    <p>{{description}}</p>
                    <p>{{itemDiscount}}</p>
                    <p>{{requirement}}</p>
                    <p>{{#if customerPoints}} {{customerPoints}} points {{/if}}</p>
                    <p>{{#if products}}Products: {{#each products}} {{name}}{{#unless @last}}, {{/unless}}</p>
                    <p>{{/each}} {{/if}}</p>
                    <p>{{#unless @last}},{{/unless}}</p>
                    <p>{{#if categories}}Categories: {{#each categories}} {{name}}{{#unless @last}}, {{/unless}}</p>
                    <p>{{/each}} {{/if}}</p>
                </div>
                <p>{{/each}}</p>
            </div>
            `
    ),
  });
}

export {
  userRewardsClass,
  addUserRewardsBlock
}
