import AppContext, { User } from "../../context/AppContext"
import { Form, Formik, FormikErrors } from "formik"
import React, { useContext, useState } from "react"
import useRequest from "../../hooks/useRequest"
import { updateUser } from "../../services/userService"
import { Button, LinearProgress, Paper, Typography } from "@mui/material"
import clsx from "clsx"
import Alert from '@mui/material/Alert'
import { TextField } from "formik-material-ui"
import LockIcon from "@mui/icons-material/Lock"
import RetryButton from "../common/button/RetryButton"
import { useStyles } from "./AccountPage"

interface ChangePasswordProps {
  user: User
  title: string
  highlight: boolean
}

interface ChangePassword {
  password: string,
  repeatPassword: string
}


export function ChangePassword({ user, title, highlight }: ChangePasswordProps) {

  const validate = (value: ChangePassword) => {
    const errors: FormikErrors<ChangePassword> = {}
    if (value.password && value.password.length <= 6) {
      errors.password = "Password is too weak!"
    } else if (value.repeatPassword && value.repeatPassword !== value.password) {
      errors.repeatPassword = "Passwords do not match!"
    }
    setCanSubmit(!!value.password && !!value.repeatPassword && !errors.password && !errors.repeatPassword)
    return errors
  }

  const [canSubmit, setCanSubmit] = useState(false)
  const [success, setSuccess] = useState<boolean | undefined>()

  const classes = useStyles()
  const context = useContext(AppContext)

  const { loading, error, performRequest } = useRequest()

  return (
    <div id="change-password">
      <Formik
        initialValues={{ password: "", repeatPassword: "" }}
        validate={validate}
        onSubmit={(values, actions) => {
          performRequest(
            () => updateUser(user._id, { password: values.password }),
            () => {
              actions.setSubmitting(false)
              setSuccess(true)
              context.setUser({
                ...user, hasPassword: true
              })
            })
        }}
      >
        {({ submitForm }) => {
          return (
            <Paper className={highlight ? clsx(classes.paper, classes.highlight) : classes.paper}>
              <Typography
                variant="h6"
                align="center">
                {title}
              </Typography>
              {success && <Alert severity="success">Password changed successfully!</Alert>}
              <Form>
                <TextField
                  className={classes.field}
                  name="password"
                  type="password"
                  label="New Password"
                  required
                />
                <TextField
                  className={classes.field}
                  name="repeatPassword"
                  type="password"
                  label="Repeat Password"
                  required
                />
                <Button
                  className={classes.passwordBtn}
                  disabled={loading || !canSubmit}
                  onClick={submitForm}
                  startIcon={(<LockIcon/>)}
                  variant="contained"
                >{title}</Button>
              </Form>
              <RetryButton error={error}/>
              <div style={{ marginTop: '10px' }}>
                {loading && <LinearProgress/>}
              </div>
            </Paper>
          )
        }}
      </Formik>
    </div>
  )

}
