import React, { useEffect, useState } from "react"
import { someParentHasClassname } from "../util/classUtils"
import { copyToClipboard } from "../util/clipboard"
import { replaceQRCodes } from "./QRCode"

import './referrer.css'

const REFERRAL_BUTTON_CLASS = "referrer-button"

export function ReferrerDialog({ user, referUrl }) {

  const [open, setOpen] = useState(false)
  const [tooltip, setTooltip] = useState()

  useEffect(() => {
    const callback = e => {
      // Open when clicking the button. Close if clicking outside
      if (someParentHasClassname(e.target, REFERRAL_BUTTON_CLASS)) {
        setOpen(!open)
      } else if (!someParentHasClassname(e.target, "referral__dialog")) {
        setOpen(false)
      }
    }
    window.addEventListener("click", callback, { passive: true })
    return () => window.removeEventListener("click", callback, { passive: true })
  }, [open])

  useEffect(() => {
    if (open) replaceQRCodes()
  }, [open])

  const refers = user?.referrerFor?.length
  const maxRefers = user?.maxRefers

  return open ? (
    <div className="referral__dialog ease-in duration-300">
      <button className="referral__dialog-close" onClick={() => setOpen(false)}>✖</button>
      <h2 className="text-indigo-700 text-opacity-80 text-xl font-bold m-2 mb-4">Your referral code</h2>

      <p className="text-gray-500 text-opacity-90 my-4">Tell your friend to scan the code for new rewards.</p>
      <div className="my-2 flex justify-center" data-qrcode={referUrl}/>

      <div>
        {refers !== undefined && <p className="text-md text-opacity-90">
          <span className="font-bold"> {refers}{maxRefers ? `/${maxRefers}` : ""}</span> refers used
        </p>}

        {tooltip?.length > 0 &&
        <div className="referral__tooltip ease-in duration-300">
          <span>{tooltip}</span>
        </div>}
        <button
          className="referral__copy-clipboard mt-2"
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
    </div>
  ) : null

}
