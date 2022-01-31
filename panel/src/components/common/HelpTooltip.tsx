import Tooltip from "@material-ui/core/Tooltip"
import React from "react"
import { Typography } from "@material-ui/core"
import HelpIcon from "@material-ui/icons/Help"

interface SimpleTooltipProps {
  title: string,
  text: string
  size?: "default" | "small" | "large"
}

export default function HelpTooltip({ title, text, size }: SimpleTooltipProps) {

  return (
    <Tooltip
      enterDelay={200}
      leaveDelay={300}
      enterTouchDelay={0}
      title={
        <React.Fragment>
          <Typography>{title}</Typography>
          {text}
        </React.Fragment>
      }
    >
      <HelpIcon fontSize={size || "small"} style={{marginLeft: '10px'}}/>
    </Tooltip>
  )
}
