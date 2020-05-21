import React from "react";


const campaignsClass = "loyally-campaigns"
const campaignItemClass = "loyally-campaign"
const campaignRewardsClass = "loyally-campaign-rewards"
const campaignRewardClass = "loyally-campaign-reward"

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