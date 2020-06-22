import qrcode from "qrcode-generator"

const DATA_IDENTIFIER: string = '[data-qrcode]'

export function replaceQRCodes() {

    const elements = document.querySelectorAll(DATA_IDENTIFIER)
    elements.forEach(el => {
        const code = el.attributes.getNamedItem(DATA_IDENTIFIER)?.value
        if (code) {
            const qr = qrcode(0, 'L')
            qr.addData(code)
            qr.make()
            el.innerHTML = qr.createSvgTag()
        }
    })

}