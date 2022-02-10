import { IconButton, IconButtonProps, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import CloseIcon from '@mui/icons-material/Close'
import React from "react"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      color: theme.palette.grey[500],
    },
  }))


export default function (props: IconButtonProps) {

  const classes = useStyles()

  return (
    <IconButton
      {...props}
      className={classes.closeButton}
      aria-label="close"
      size="large">
      <CloseIcon/>
    </IconButton>
  )
}
