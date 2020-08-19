import qrcode from "qrcode-generator"

const QR_DATA_IDENTIFIER: string = '[data-qrcode]'

/**
 * Replaces elements identified with {@link QR_DATA_IDENTIFIER} with the actual QR code images.
 */
export function replaceQRCodes() {

    const elements = document.querySelectorAll(QR_DATA_IDENTIFIER)
    elements.forEach(el => {
        const code = el.attributes.getNamedItem(QR_DATA_IDENTIFIER)?.value
        if (code) {
            const qr = qrcode(0, 'L')
            qr.addData(code)
            qr.make()
            el.innerHTML = qr.createSvgTag()
        }
    })

}