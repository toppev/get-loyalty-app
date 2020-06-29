/** Controller for QR code scans */
const POLLING_IDENTIFIERS = require('../../services/pollingService').IDENTIFIERS;

const router = require('express').Router({ mergeParams: true });
const permit = require('../../middlewares/permitMiddleware');
const scanService = require('../../services/scanService');
const pollingService = require('../../services/pollingService');

// The :scan consist of <userId>:<rewardId> or just the userId
// Might change later even though the QR code reader performance difference is not huge
// Therefore, use scanService#parseScanString to parse it

// Get information about the scan
router.get('/:scan', permit('scan:get'), getScan);
// Confirm purchase/use reward
router.post('/:scan', permit('scan:use'), useScan);

module.exports = router;

function getScan(req, res, next) {
    const { businessId, scan } = req.params;
    scanService.getScan(scan, businessId)
        .then(data => res.json(data))
        .catch(err => {
            next(err);
            // Notify user that the request failed
            pollingService.sendToUser(scan.split(':')[0], { message: 'Scan failed!', refresh: false }, POLLING_IDENTIFIERS.SCAN)
        });
}

function useScan(req, res, next) {
    const { businessId, scan } = req.params;
    scanService.useScan(scan, req.body, businessId)
        .then(data => res.json(data))
        .catch(err => next(err));
}
