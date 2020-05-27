import React from "react";


const campaignsClass = "loyalty-campaigns"
const campaignItemClass = "loyalty-campaign"
const campaignRewardsClass = "loyalty-campaign-rewards"
const campaignRewardClass = "loyalty-campaign-reward"

/**
 * Block to list on going campaigns
 */
function addCampaignsBlock(blockManager: any) {
    blockManager.add(campaignsClass, {
        label: `Campaigns`,
        content: (`
            <div class="${campaignsClass}">
                <h2>Campaigns</h2>
                {{#each campaigns}}
                <div class="${campaignItemClass}">
                    <h3>{{name}}</h3>
                    // TODO
                    <br/>
                    <div class="${campaignRewardsClass}">
                        {{#each campaign.rewards}}
                        <div class="${campaignRewardClass}">
                            {{name}}
                            // TODO
                        </div>
                    </div>
                </div>
            </div>
            `
        ),
    });
}

export {
    campaignsClass,
    campaignItemClass,
    addCampaignsBlock,
}