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
                <h2><b>Campaigns</b> ({{campaigns.length}})</h2>
                <p>{{#each campaigns}}</p>
                <div class="${campaignItemClass}">
                    <h3>{{name}}</h3>
                    <p>{{description}}</p>
                    <p>Starts: {{start}}</p>
                    <p>{{#if end}}Ends: {{end}}{{/if}}</p>
                    <br/>
                    <div style="font-size: 22px;">
                        <p>{{#if totalStampsNeeded}}</p>
                        <p>{{currentStamps}}/{{totalStampsNeeded}}</p>
                        <div style="font-size: 24px">
                            <p>{{#each currentStamps}}${POINTS_ICON}</p>
                            <p>{{/each}}</p>
                            <p>{{#each stampsNeeded}}${POINTS_NEEDED_ICON}</p>
                            <p>{{/each}}</p>
                        </div>
                        <p>{{/if}}</p>
                    </div>
                    <div class="${campaignRewardsClass}">
                        <p>{{#each rewards}}</p>
                            <div class="${campaignRewardClass}">
                                <p>{{name}}</p>
                                <p>{{description}}</p>
                                <p>{{itemDiscount}}</p>
                                <p>{{requirement}}</p>
                                <p>{{customerPoints}} {{translation.points.plural}}</p>
                            </div>
                        <p>{{/each}}</p>
                    </div>
                </div>
                <p>{{/each}}</p>
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
