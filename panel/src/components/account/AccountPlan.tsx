import { Divider, Link, Paper, Typography } from "@material-ui/core"
import React, { useContext } from "react"
import { useStyles } from "./AccountPage"
import AppContext from "../../context/AppContext"

const PLANS_URL = "https://getloyalty.app/#plans"
const CONTACT_URL = "https://getloyalty.app/contact"

export function AccountPlan() {

  const classes = useStyles()
  const { business } = useContext(AppContext)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, type, limits } = business.plan

  return (
    <Paper className={classes.paper}>
      <Typography style={{ fontSize: '18px' }} variant="h4"> Current plan </Typography>
      <Typography variant="h5" color="primary" style={{ fontWeight: 'bold' }}>{name}</Typography>

      <Divider style={{ margin: '25px 0' }}/>

      <Typography variant="h6">
        View all plans <Link target="_blank" rel="noopener" variant="h6" href={PLANS_URL}>here</Link>.
      </Typography>

      <div style={{ marginTop: '20px' }}>
        <Link target="_blank" rel="noopener" variant="h6" href={CONTACT_URL}>Contact us!</Link>
      </div>

    </Paper>
  )
}
