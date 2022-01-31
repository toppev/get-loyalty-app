import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core"
import React, { useContext } from "react"
import AppContext from "../../context/AppContext"
import { ChangePassword } from "./ChangePassword"
import { EmailForm } from "./ChangeEmail"
import { AccountPlan } from "./AccountPlan"

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: '25px',
      margin: '20px',
      flex: '1 1 0px',
      height: '300px'
    },
    field: {
      width: '100%',
      marginTop: '20px',
      marginBottom: '20px'
    },
    highlight: {
      border: '1px solid red',
      boxShadow: '0px 0px 8px 2px red'
    },
    passwordBtn: {
      backgroundColor: theme.palette.success.light,
    },
    progressErrorDiv: {
      margin: '20px 10px'
    }
  }))

export default function () {

  const { user } = useContext(AppContext)

  return (
    <div>

      <Grid item xs={12} md={6}>
        <AccountPlan/>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <EmailForm
            user={user}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ChangePassword
            user={user}
            title={user.hasPassword ? "Reset Password" : "Set Password"}
            highlight={!user.hasPassword}
          />
        </Grid>

      </Grid>
    </div>
  )
}
