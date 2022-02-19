/** Controller for QR code scans */
import { Router } from "express"
import permit from "../../middlewares/permitMiddleware"
import scanService from "../../services/scanService"
import pollingService from "../../services/pollingService"

const router = Router()
// The :scan consist of <userId>:<rewardId> or just the userId
// Might change later even though the QR code reader performance difference is not huge
// Therefore, use scanService#parseScanString to parse it

// Get information about the scan
router.get('/:scan', permit('scan:get'), getScan)
// Confirm purchase/use reward
router.post('/:scan', permit('scan:use'), useScan)

export default router

function getScan(req, res, next) {
  const { scan } = req.params
  scanService.getScanInfo(scan)
    .then(data => res.json(data))
    .catch(err => {
      next(err)
      // Notify user that the request failed
      pollingService.sendToUser(scan.split(':')[0], { message: 'Scan failed!', refresh: false }, pollingService.IDENTIFIERS.SCAN)
    })
}

function useScan(req, res, next) {
  const { scan } = req.params
  scanService.useScan(scan, req.body)
    .then(data => res.json(data))
    .catch(err => next(err))
}
