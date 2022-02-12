import { Button, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import RefreshIcon from '@mui/icons-material/Refresh'
import React from "react"
import RequestError from "../../../util/requestError"

interface ButtonProps {
  error?: RequestError
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    retryButton: {
      margin: '20px'
    },
    errorDiv: {
      margin: 'auto',
      width: '50%',
      textAlign: 'center',
    },
    errorText: {
      color: 'red'
    },
    errorName: {
      color: 'lightcoral'
    }
  }))

export default function RetryButton({ error: errorObject }: ButtonProps) {

  const classes = useStyles()

  const { message, error, retry, clearError } = errorObject || {}

  const errorString = error?.response?.data?.message || error?.toString() || 'unknown error'

  return !!errorObject ? (
    <div className={classes.errorDiv}>
      <p className={classes.errorText}>{message}</p>
      <p className={classes.errorName}>{errorString}</p>
      {retry &&
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          retry()
          if (clearError) {
            clearError()
          }
        }}
        startIcon={<RefreshIcon/>}
        className={classes.retryButton}
      >Retry</Button>
      }
    </div>
  ) : null
}
