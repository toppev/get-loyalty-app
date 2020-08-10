const DATA_IDENTIFIER = 'data-qrcode'
const loyaltyQRCode = 'loaylty-qrcode'

function addQRCodeType(editor: any) {
    editor.DomComponents.addType(loyaltyQRCode, {
        isComponent: (el: any) => el.tagName == loyaltyQRCode,
        model: {
            defaults: {
                draggable: true,
                attributes: {
                    type: 'text',
                    name: 'QR Code',
                    [DATA_IDENTIFIER]: 'URL or a placeholder'
                },
                traits: [{
                    type: 'text',
                    label: 'Data',
                    name: DATA_IDENTIFIER
                }],
            },
        },
        view: {
            onRender({ el }: any) {
                const img = document.createElement('img');
                img.src = './images/qrPlaceholder.png';
                img.alt = 'QR Code Placeholder'
                el.appendChild(img);
            },
        }
    });
}

function addQRCodeBlock(blockManager: any) {
    blockManager.add(loyaltyQRCode, {
        label: `QR Code`,
        content: `<span data-gjs-type=${loyaltyQRCode}>QR CODE</span>`,
        render: ({ model }: any) => `<div class="gjs-block-label" style="margin-top: 30px;">${model.get('label')}</div></div>`,
    });
}

export {
    addQRCodeType,
    addQRCodeBlock,
    loyaltyQRCode,
    DATA_IDENTIFIER,
}