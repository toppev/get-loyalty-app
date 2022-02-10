import { Button, ButtonProps, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import AddIcon from "@mui/icons-material/Add"
import React from "react"
import makeStyles from '@mui/styles/makeStyles'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    newBtn: {
      backgroundColor: theme.palette.success.main,
    },
  }))

interface NewButtonProps {
  name: string
  buttonProps: ButtonProps
}

export default function (props: NewButtonProps) {

  const classes = useStyles()

  return (
    <div>
      <Button
        variant="contained"
        startIcon={(<AddIcon/>)}
        {...props.buttonProps}
        className={`${classes.newBtn} ${props.buttonProps.className || ""}`}
      >{props.name}</Button>
    </div>
  )
}
