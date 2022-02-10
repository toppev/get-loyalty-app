import AppContext, { User } from "../../context/AppContext"
import React, { useContext, useState } from "react"
import { Form, Formik, FormikErrors } from "formik"
import { isEmail } from "../../util/validate"
import useRequest from "../../hooks/useRequest"
import { updateServerOwner } from "../../services/serverService"
import { updateUser } from "../../services/userService"
import { Button, LinearProgress, Paper } from "@mui/material"
import clsx from "clsx"
import { TextField } from "formik-material-ui"
import RetryButton from "../common/button/RetryButton"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import { useStyles } from "./AccountPage"

interface EmailFormProps {
  user: User
}

type EmailValues = { email: string };

export function EmailForm({ user }: EmailFormProps) {

  const classes = useStyles()
  const context = useContext(AppContext)

  const [canSubmit, setCanSubmit] = useState(false)

  const validate = ({ email }: EmailValues) => {
    const errors: FormikErrors<User> = {}
    if (!isEmail(email)) {
      errors.email = "That doesn't look like an email address."
    }
    setCanSubmit(!errors.email && email !== user.email)
    return errors
  }

  const initialValues: EmailValues = { email: user.email }

  const { error, performRequest, loading } = useRequest()

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validateOnBlur
        validate={validate}
        onSubmit={(value, actions) => {
          actions.setSubmitting(true)
          performRequest(async () => {
            // TODO: make sure we don't only update in one service
            await updateServerOwner({ email: context.user.email, updated: { email: value.email } })
            await updateUser(user._id, value)
          }, () => {
            actions.setSubmitting(false)
            context.setUser({
              ...user, ...value
            })
          })
        }}
      >
        {({ submitForm }) => (
          <Paper className={!user.email ? clsx(classes.paper, classes.highlight) : classes.paper}>
            <Form>
              <TextField
                className={classes.field}
                name="email"
                type="text"
                label="Account Email"
                placeholder="example@email.com"
              />
              <div className={classes.progressErrorDiv}>
                {loading && <LinearProgress/>}
                <RetryButton error={error}/>
              </div>
              <Button
                disabled={loading || !canSubmit}
                onClick={submitForm}
                variant="contained"
                color="primary"
                startIcon={<MailOutlineIcon/>}
              >Update email</Button>
            </Form>
          </Paper>
        )}
      </Formik>
    </div>
  )
}
