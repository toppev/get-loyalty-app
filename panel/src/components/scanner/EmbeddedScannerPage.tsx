import React from "react"
import { DOMAIN_HOME_PAGE } from "../Navigator"
import { Link } from "@mui/material"
import Tip from "../common/Tip"


export default function EmbeddedScannerPage() {

  const src = `https://scan.${DOMAIN_HOME_PAGE}`

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Tip insertTip={false}>
          This embedded version might not work 100% on all devices.
          <br/>
          <Link href={src} target="_blank">Click here to open the full version in new window</Link>
        </Tip>
      </div>
      <div style={{ height: '80vh' }}>
        <iframe
          allowTransparency
          style={{ background: "#FFFFFF" }}
          title="Embedded Scanner"
          height="100%"
          width="100%"
          frameBorder="0"
          src={src}
        />
      </div>
    </div>
  )
}
