import { Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React from "react"

interface TipProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  /**
   * Whether to automatically add "TIP:".
   * True by default
   */
  insertTip?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: '8px 12px',
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.info.dark,
      display: 'inline-block',
      borderRadius: '5px'
    },
    tip: {
      fontWeight: 'bold',
      fontSize: '14px'
    }
  }))

export default function Tip({ insertTip, children, ...props }: TipProps) {

  const classes = useStyles()

  return (
    <div className={classes.paper} {...props}>
      {insertTip !== false && <span className={classes.tip}>TIP: </span>}
      {children}
    </div>
  )
}
