/**
 * This is a controller handles when a customer scans a coupon QR code.
 */
const router = require('express').Router({ mergeParams: true });
const customerService = require('../../services/customerService');
const campaignService = require('../../services/campaignService');
const userService = require('../../services/userService');

// Claim a coupon reward
router.post('/{coupon}', getCoupon);

module.exports = router;

async function getCoupon(req, res, next) {
    try {
        const { businessId, coupon } = req.params;
        const user = req.user;
        const userId = user.id;
        const campaign = await campaignService.byCouponCode(businessId, coupon);
        if (await customerService.canReceiveCampaignRewards(userId, businessId, campaign)) {
            const rewards = await customerService.addCampaignRewards(userId, campaign)
            res.json({
                rewards: rewards,
                user: req.user
            })
        }

    } catch (err) {
        next(err)
    }
}