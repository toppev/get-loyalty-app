const campaignsClass = "loyalty-campaigns"
const campaignItemClass = "loyalty-campaign"
const campaignRewardsClass = "loyalty-campaign-rewards"
const campaignRewardClass = "loyalty-campaign-reward"


const POINTS_ICON = `💰💰💰&#128176;` // Money bag icon (for testing)
const POINTS_NEEDED_ICON = `💰💰💰&#128230;` // Package icon (for testing)

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
                    <p>{{description}}</p>
                    <p>{{start}} - {{end}}</p>
                    <br/>
                    <div style="font-size: 16px; font-weight: bold">
                        {{campaign.currentStamps}}/{{campaign.totalStampsNeeded}}
                        <div style="font-size: 24px">
                            {{#each campaign.currentStamps}}
                            ${POINTS_ICON}
                            {{#each campaign.stampsNeeded}}
                            ${POINTS_NEEDED_ICON}                  
                        </div>
                    </div>
                    <div class="${campaignRewardsClass}">
                        {{#each campaign.rewards}}
                        <div class="${campaignRewardClass}">
                            <p>{{name}}</p>
                            <p>{{description}}</p>
                            <p>{{itemDiscount}}</p>
                            <p>{{requirement}}</p>
                            <p>{{customerPoints}} {{translation.points.plural}}</p>
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