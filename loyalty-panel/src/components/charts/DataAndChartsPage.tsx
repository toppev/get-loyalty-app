import React from "react"
import { Box, createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core"
import { Line } from 'react-chartjs-2'
import useRequest from "../../hooks/useRequest"
import { listCustomers } from "../../services/customerService"
import RetryButton from "../common/button/RetryButton"
import Customer from "../customers/Customer"
import useResponseState from "../../hooks/useResponseState"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
        minWidth: '500px',
        margin: '25px',
      },
    },
    chartDates: {
      color: theme.palette.grey[400],
      marginTop: '0'
    },
    center: {
      textAlign: 'center'
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

  const today = new Date()
  const startOfYear = new Date()
  startOfYear.setFullYear(2020, 0, 1)

  return error ? (
    <RetryButton error={error}/>
  ) : (
    <div>
      {loading && <LinearProgress/>}
      <p className={classes.p}>
        (work in progress)
      </p>
      <Box display="flex" flexWrap="wrap">
        <div className={classes.chart}>
          <DateChart
            title="New Customers"
            label="new customers joined"
            customDateString={"(" + startOfYear.getFullYear() + ")"}
            dateData={customerCreatedDates}
            fromDate={startOfYear}
            toDate={today}
          />
          <DateChart
            title="Last Activity"
            label="customers last visit on the app"
            customDateString={"(" + startOfYear.getFullYear() + ")"}
            dateData={customerLastActiveDates}
            fromDate={startOfYear}
            toDate={today}
          />
        </div>
      </Box>
    </div>
  )
}


const COMMON_LINE_CHART_OPTIONS = {
  scales: {
    yAxes: [{
      ticks: { beginAtZero: true, },
    }]
  }
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
    <div>
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
