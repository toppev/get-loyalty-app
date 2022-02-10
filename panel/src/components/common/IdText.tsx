import { Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React from "react"

interface IdTextProps {
  id: string | undefined
  text?: string | boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemId: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
      color: 'rgba(0,0,0,0.5)',
      fontSize: '0.7em',
      margin: '3px 0px 0px 0px',
      textAlign: 'right',
    },
  }))

export default function IdText({ id, text }: IdTextProps) {

  const classes = useStyles()

  return (<p className={classes.itemId}>{text === false ? "" : text || "ID:"} {id}</p>)
}
