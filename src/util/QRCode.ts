import qrcode from "qrcode-generator"

const QR_DATA_IDENTIFIER = 'data-qrcode'

/**
 * Replaces elements identified with {@link QR_DATA_IDENTIFIER} with the actual QR code images.
 */
export function replaceQRCodes() {

    const elements = document.querySelectorAll(`[${QR_DATA_IDENTIFIER}]`)
    elements.forEach(el => {
        const code = el.attributes.getNamedItem(QR_DATA_IDENTIFIER)?.value
        if (code) {
            const qr = qrcode(0, 'L')
            qr.addData(code)
            qr.make()
            el.innerHTML = qr.createSvgTag()

            const svgSize = "100%"
            const svgMaxSize = "360px"
            Array.from(el.children).forEach(child => {
                child.setAttribute("height", svgSize)
                child.setAttribute("width", svgSize)
                // @ts-ignore
                if (child.style) child.style.maxWidth = svgMaxSize
            })
        }
    })

}