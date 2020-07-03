/**
 * This is a controller handles when a customer scans a coupon QR code.
 */
const router = require('express').Router({ mergeParams: true });
const customerService = require('../../services/customerService');
const campaignService = require('../../services/campaignService');
const User = require('../../models/user');

// Claim a coupon reward
router.post('/:coupon', getCoupon);

module.exports = router;

async function getCoupon(req, res, next) {
    try {
        const { businessId, coupon } = req.params;
        const userId = req.user.id;
        const campaign = await campaignService.byCouponCode(businessId, coupon);
        if (await campaignService.canReceiveCampaignRewards(userId, businessId, campaign)) {
            const user = await User.findById(userId)
            const rewards = await customerService.addCampaignRewards(user, campaign)
            await user.save()
            res.json({
                rewards: rewards,
                user: req.user
            })
        }

    } catch (err) {
        next(err)
    }
}