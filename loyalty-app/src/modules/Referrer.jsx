import React, { useEffect, useState } from "react";
import { someParentHasClassname } from "../util/classUtils";
import './referrer.css';
import { copyToClipboard } from "../util/clipboard";
import { replaceQRCodes } from "./QRCode";

const REFERRAL_BUTTON_CLASS = "referrer-button"

export function ReferrerDialog({ user, referUrl }) {

    const [open, setOpen] = useState(false)
    const [tooltip, setTooltip] = useState()

    useEffect(() => {
        window.addEventListener("click", e => {
            // Open when clicking the button. Close if clicking outside
            if (someParentHasClassname(e.target, REFERRAL_BUTTON_CLASS)) {
                setOpen(true)
            } else if (!someParentHasClassname(e.target, "dialog")) {
                setOpen(false)
            }
        }, { passive: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (open) replaceQRCodes()
    }, [open])

    const refers = user?.referrerFor?.length
    const maxRefers = user?.maxRefers

    return open ? (
        <div className="dialog">
            <button className="dialog-close" onClick={() => setOpen(false)}>✖</button>
            <h2 className="dialog-title">Your referral code</h2>

            <div data-qrcode={referUrl}/>

            <p className="dialog-description">Tell your friend to scan the code for new rewards.</p>

            {refers !== undefined && <p>{refers}{maxRefers ? `/${maxRefers}` : ""} refers used</p>}

            {tooltip?.length > 0 && <div className="tooltip">
                <span>{tooltip}</span>
            </div>}
            <button
                className="copy-clipboard"
                onClick={() => {
                    copyToClipboard(referUrl)
                        .then(() => {
                            // success, display a message
                            setTooltip("Copied to clipboard!")
                            setTimeout(() => setTooltip(undefined), 2000)
                        })
                }}
            >⎘ Copy code
            </button>
        </div>
    ) : null

}
