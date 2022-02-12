import Tooltip, { TooltipProps } from "@mui/material/Tooltip"
import copy from "clipboard-copy"
import React, { useState } from "react"

interface ChildProps {
  copy: (content: any) => void;
}

interface CopyToClipboardProps {
  TooltipProps?: Partial<TooltipProps>;
  children: (props: ChildProps) => React.ReactElement<any>;
}

export default function CopyToClipboard(props: CopyToClipboardProps) {

  const [tooltip, setTooltip] = useState(false)

  const onCopy = async (content: any) => {
    await copy(content)
    setTooltip(true)
  }

  return <Tooltip
    open={tooltip}
    title={"Copied to clipboard!"}
    leaveDelay={1500}
    onClose={() => setTooltip(false)}
    {...props.TooltipProps || {}}
  >
    {props.children({ copy: onCopy })}
  </Tooltip>
}
