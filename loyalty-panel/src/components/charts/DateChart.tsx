import { Card } from "@material-ui/core"
import { Line } from "react-chartjs-2"
import React from "react"
import { ChartProps, COMMON_LINE_CHART_OPTIONS, useChartStyles } from "./ChartConsts"

interface DateChartProps extends ChartProps {
  dateData: Date[]
  customDateString?: string
  fromDate: Date
  toDate: Date
}


export function DateChart(props: DateChartProps) {

  const classes = useChartStyles()
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
    <Card raised className={classes.chart}>
      <div className={classes.center}>
        <h2 className={classes.chartTitle}>{props.title}</h2>
        <p className={classes.chartDates}>
          {customDateString || fromDate.toLocaleDateString() + "-" + toDate.toLocaleDateString()}
        </p>
      </div>
      {/* @ts-ignore  */}
      <Line data={data} options={COMMON_LINE_CHART_OPTIONS}/>
    </Card>
  )
}
