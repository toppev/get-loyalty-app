import React from "react"
import { Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import DOMPurify from 'dompurify'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconPreview: {
      '& *': {
        height: '40px'
      }
    },
  }))

interface PageIconProps {
  icon: string
}

export default function PageIcon({ icon: dirtyIcon }: PageIconProps) {

  const classes = useStyles()

  // Sanitize to protect admins viewing the page
  const icon = DOMPurify.sanitize(dirtyIcon)

  return (
    <p className={classes.iconPreview} dangerouslySetInnerHTML={{ __html: icon }}/>
  )
}
