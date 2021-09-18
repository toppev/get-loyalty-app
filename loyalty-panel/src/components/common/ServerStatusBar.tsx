import { waitForServer } from "../../services/serverService"
import { Alert } from "@material-ui/lab"
import React, { useEffect, useState } from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core"

type StatusBarState = { severity: 'success' | 'info' | 'warning' | 'error', message: string }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statusBar: {
      marginTop: '10px'
    },
  }))

let incrementDelay = 0 // increment delay every time so afk wont spam it

export function ServerStatusBar() {

  const classes = useStyles()

  const [serverState, setServerState] = useState<StatusBarState>({ severity: 'info', message: 'Loading status...' })

  const checkStatus = () => {
    incrementDelay++
    waitForServer(data => {
      setServerState({ severity: "success", message: "Your server is online since " + (new Date(data.onlineSince).toLocaleString()) })
      setTimeout(checkStatus, 10_000 + (incrementDelay * 5000))
    }, () => {
      setServerState({ severity: "error", message: "Your server could not be reached." })
      // #waitForServer automatically reattempts
    })
  }

  useEffect(() => {
    checkStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Alert className={classes.statusBar} severity={serverState.severity}>{serverState.message}</Alert>
    </div>
  )
}
