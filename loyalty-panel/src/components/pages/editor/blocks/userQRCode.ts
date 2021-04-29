import { DATA_IDENTIFIER, loyaltyQRCode } from "./qrCodeBlock";

const userQRCode = "loyalty-user-qr-code";

function addUserQRBlock(blockManager: any) {
  blockManager.add(userQRCode, {
    label: `User QR-code`,
    content: {
      type: loyaltyQRCode,
      attributes: {
        [DATA_IDENTIFIER]: '{{ user.id }}'
      }
    }
  });
}

export {
  userQRCode,
  addUserQRBlock
}
