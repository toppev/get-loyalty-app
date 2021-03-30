const referralButtonClass = "referrer-button"

function addReferralButton(blockManager: any) {
    blockManager.add(referralButtonClass, {
        label: `Referral Button`,
        content: (
            `<button
                class="${referralButtonClass}"
                style="
                    background-color: mediumturquoise;
                    border-radius: 4px;
                    padding: 6px 20px;
                    margin: 0;
                    cursor: pointer;
                    border: 1px solid #bbb;
                    overflow: visible;
                    text-decoration: none;"
            >Refer a friend</button>`
        ),
    });
}

export {
    addReferralButton
}
