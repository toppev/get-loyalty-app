import React from "react"
import { Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      fontSize: '11px'
    },
    link: {
      textDecorationLine: 'none'
    }
  }))

export default function PrivacyLink() {

  const classes = useStyles()

  return (
    <span className={classes.text}>
            See our <a href={'/privacy'} className={classes.link}>privacy policy</a>
    </span>
  )
}
