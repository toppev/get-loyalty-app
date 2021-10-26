import React, { Fragment } from "react"
import { Box, createStyles, Divider, LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core"
import useRequest from "../../hooks/useRequest"
import { listCustomers } from "../../services/customerService"
import RetryButton from "../common/button/RetryButton"
import Customer from "../customers/Customer"
import useResponseState from "../../hooks/useResponseState"
import { DateChart } from "./DateChart"
import { UsageLengthChart } from "./UsageLengthChart"
import ExportData from "./ExportData"
import { ErrorBoundary } from "../ErrorBoundary"

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '38px',
      color: 'ghostwhite',
      textAlign: 'center',
      margin: '20px auto',
      [theme.breakpoints.up('sm')]: {
        textAlign: 'start',
        margin: '20px 40px',
      }
    },
    p: {
      fontSize: '14px',
      color: theme.palette.grey[600]
    },
    divider: {
      margin: '20px 0',
      backgroundColor: theme.palette.grey[800]
    },
  }))

// We currently calculate and build almost everything on frontend.
// This may cause problems in the future with a lot of customers (at least I hope so)
// But it's good enough for now
export default function () {

  const classes = useStyles()

  const { error, loading, response } = useRequest(() => listCustomers(undefined, -1))
  const [customers] = useResponseState<Customer[]>(response, [], (res) => {
    return res.data.customers?.map((it: any) => new Customer(it)) || []
  })

  const customerCreatedDates = customers.map(it => it.createdAt)
  const customerLastActiveDates = customers.filter(it => it.lastVisit).map(it => it.lastVisit!!)
  const customerUsageLength = customers.filter(it => it.lastVisit).map(it => {
    const lastVisit = it.lastVisit?.getTime() || it.createdAt.getTime()
    return Math.max(0, lastVisit - it.createdAt.getTime())
  })

  const today = new Date()
  const startOfYear = new Date()
  startOfYear.setFullYear(today.getFullYear(), 0, 1)

  const charts = [
    {
      id: 'new_customers',
      component: (
        <DateChart
          title="New Customers"
          label="new customers joined"
          customDateString={"(" + startOfYear.getFullYear() + ")"}
          dateData={customerCreatedDates}
          fromDate={startOfYear}
          toDate={today}
        />
      )
    }, {
      id: 'last_activity',
      component: (
        <DateChart
          title="Last Activity"
          label="customers last visit on the app"
          customDateString={"(" + startOfYear.getFullYear() + ")"}
          dateData={customerLastActiveDates}
          fromDate={startOfYear}
          toDate={today}
        />
      )
    }, {
      id: 'usage_length',
      component: (
        <UsageLengthChart
          title="Usage Retention"
          label="how many customers have used the app longer than"
          joinLastDiff={customerUsageLength}
        />
      )
    }
  ]


  return error ? (
    <RetryButton error={error}/>
  ) : (
    <div>
      <p className={classes.p}>
        (work in progress)
      </p>
      <div>
        <Typography variant="h1" className={classes.title}>A few cool charts</Typography>
        {loading && <LinearProgress/>}
        <Box display="flex" flexWrap="wrap">
          {charts.map(it => (
            <Fragment key={it.id}>
              <ErrorBoundary>
                {it.component}
              </ErrorBoundary>
            </Fragment>)
          )}
        </Box>
      </div>
      <Divider className={classes.divider}/>
      <div>
        <Typography id="export-data" variant="h1" className={classes.title}>Export data</Typography>
        <ExportData/>
      </div>
    </div>
  )
}


