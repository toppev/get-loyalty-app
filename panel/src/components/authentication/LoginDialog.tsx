import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import React from 'react'
import LoginForm from './LoginForm'
import { Theme } from '@mui/material'

import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

interface LoginDialogProps {
  open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogRoot: {
      [theme.breakpoints.down('sm')]: {
        minWidth: '95%'
      }
    },
  }))

export default function LoginDialog({ open }: LoginDialogProps) {

  const classes = useStyles()

  return open ? (
    <Dialog open={open} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogRoot }}>
      <DialogContent>
        <LoginForm/>
      </DialogContent>
    </Dialog>
  ) : null
}
