import React, { Fragment } from "react"
import { Box, createStyles, Divider, LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core"
import { Bar, Line } from 'react-chartjs-2'
import useRequest from "../../hooks/useRequest"
import { listCustomers } from "../../services/customerService"
import RetryButton from "../common/button/RetryButton"
import Customer from "../customers/Customer"
import useResponseState from "../../hooks/useResponseState"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '38px',
      color: 'ghostwhite',
    },
    p: {
      fontSize: '14px',
      color: theme.palette.grey[600]
    },
    chartTitle: {
      color: theme.palette.grey[300],
      marginBottom: '4px'
    },
    chart: {
      margin: 'auto',
      minWidth: '95%',
      [theme.breakpoints.up('sm')]: {
        minWidth: '600px',
        margin: '40px',
      },
    },
    chartDates: {
      color: theme.palette.grey[400],
      marginTop: '0'
    },
    center: {
      textAlign: 'center'
    },
    divider: {
      margin: '60px 0',
      backgroundColor: theme.palette.grey[800]
    }
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
          label="how many customers have used the app this long"
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
          {charts.map(it => <Fragment key={it.id}>{it.component}</Fragment>)}
        </Box>
      </div>
      <Divider className={classes.divider}/>
      <div>
        <Typography variant="h1" className={classes.title}>Export data & API</Typography>
        <div style={{ height: '800px' }}>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  )
}


const COMMON_LINE_CHART_OPTIONS = {
  scales: {
    yAxes: [{
      ticks: { beginAtZero: true, },
    }],

  },
}

interface ChartProps {
  title: string
  label: string
}

interface DateChartProps extends ChartProps {
  dateData: Date[]
  customDateString?: string
  fromDate: Date
  toDate: Date
}

function DateChart(props: DateChartProps) {

  const classes = useStyles()
  const { dateData, fromDate, toDate, customDateString } = props

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'].splice(fromDate.getMonth(), toDate.getMonth() + 1)

  const createdAtData = new Array(months.length).fill(0)
  dateData.forEach(date => {
    if (date && date > fromDate && date < toDate) {
      createdAtData[date.getMonth()] += 1
    }
  })

  const data = {
    labels: months,
    datasets: [{
      label: props.label,
      data: createdAtData,
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    }]
  }

  return (
    <div className={classes.chart}>
      <div className={classes.center}>
        <h2 className={classes.chartTitle}>{props.title}</h2>
        <p className={classes.chartDates}>
          {customDateString || fromDate.toLocaleDateString() + "-" + toDate.toLocaleDateString()}
        </p>
      </div>
      {/* @ts-ignore  */}
      <Line data={data} options={COMMON_LINE_CHART_OPTIONS}/>
    </div>
  )
}

interface RetentionChartProps extends ChartProps {
  joinLastDiff: number[]
}


function UsageLengthChart(props: RetentionChartProps) {

  const classes = useStyles()

  const dayInMS = 1000 * 60 * 60 * 24
  const usageLength = {
    '> year': dayInMS * 30 * 12,
    '> 6 months': dayInMS * 30 * 6,
    '> 3 months': dayInMS * 30 * 3,
    '> month': dayInMS * 30,
    '> 14 days': dayInMS * 14,
    '> week': dayInMS * 7,
    '>= day': dayInMS,
    'once': -1,
  }
  const usageLengthGroup = new Array(Object.keys(usageLength).length).fill(0)

  props.joinLastDiff.forEach(diff => {
    Object.values(usageLength).some((val, index) => {
      if (diff > val) {
        usageLengthGroup[index]++
        return true
      }
      return false
    })
  })

  const data = {
    labels: Object.keys(usageLength),
    datasets: [{
      label: props.label,
      data: usageLengthGroup,
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    }]
  }

  return (
    <div className={classes.chart}>
      <div className={classes.center}>
        <h2 className={classes.chartTitle}>{props.title}</h2>
        <p className={classes.chartDates}>All time</p>
      </div>
      {/* @ts-ignore  */}
      <Bar data={data} options={COMMON_LINE_CHART_OPTIONS}/>
    </div>
  )
}
