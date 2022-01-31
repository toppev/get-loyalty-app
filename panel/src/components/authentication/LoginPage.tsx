import React, { useContext, useEffect } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import LoginForm from './LoginForm'
import { useQuery } from "../../hooks/useQuery"
import AppContext from "../../context/AppContext"
import LoginDialog from './LoginDialog'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    div: {},
  }))

export default function LoginPage() {

  const classes = useStyles()

  const query = useQuery()
  const { loggedIn, user } = useContext(AppContext)

  useEffect(() => {
    let redirect = query.get('redirect')?.trim()
    if (loggedIn && user.email?.trim()?.length && redirect?.length) {
      if (redirect.startsWith('https://getloyalty.app')) {
        const actualUrl = new URL(redirect)
        actualUrl.searchParams.set('email', user.email)
        window.location.href = actualUrl.href
      } else {
        alert(`Not allowed redirect url: ${redirect}`)
      }
    }
  }, [loggedIn, user, query])

  return (
    <div className={classes.div}>
      <LoginDialog open/>
    </div>
  )
}
