import { DATA_IDENTIFIER, loyaltyQRCode } from "./qrCodeBlock"

const rewardQRCode = "loyalty-reward-qr-code"

function addRewardQRBlock(blockManager: any) {
  blockManager.add(rewardQRCode, {
    label: `Reward QR-code`,
    content: {
      type: loyaltyQRCode,
      attributes: {
        [DATA_IDENTIFIER]: '{{scanCode}}'
      }
    }
  })
}

export {
  rewardQRCode,
  addRewardQRBlock
}
