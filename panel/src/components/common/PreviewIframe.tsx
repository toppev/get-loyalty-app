import React, { HTMLProps } from "react"


export default function PreviewIframe(props: HTMLProps<HTMLIFrameElement>) {

  return (
    <iframe
      title="Preview"
      style={{ backgroundColor: 'white' }}
      height={750}
      width={420}
      {...props}
    />
  )
}
