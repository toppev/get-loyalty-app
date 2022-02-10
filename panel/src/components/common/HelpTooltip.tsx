import Tooltip from "@mui/material/Tooltip"
import React from "react"
import { Typography } from "@mui/material"
import HelpIcon from "@mui/icons-material/Help"

interface SimpleTooltipProps {
  title: string,
  text: string
  size?: 'inherit' | 'large' | 'medium' | 'small',
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
      <HelpIcon fontSize={size || "small"} style={{ marginLeft: '10px' }}/>
    </Tooltip>
  )
}
