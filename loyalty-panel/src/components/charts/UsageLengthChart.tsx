import { Card } from "@material-ui/core"
import { Bar } from "react-chartjs-2"
import React from "react"
import { ChartProps, COMMON_LINE_CHART_OPTIONS, useChartStyles } from "./ChartProps"

interface RetentionChartProps extends ChartProps {
  joinLastDiff: number[]
}

export function UsageLengthChart(props: RetentionChartProps) {

  const classes = useChartStyles()

  const dayInMS = 1000 * 60 * 60 * 24
  const usageLength = {
    '> year': dayInMS * 30 * 12,
    '> 6 months': dayInMS * 30 * 6,
    '> 3 months': dayInMS * 30 * 3,
    '> 2 months': dayInMS * 30 * 2,
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
    <Card raised className={classes.chart}>
      <div className={classes.center}>
        <h2 className={classes.chartTitle}>{props.title}</h2>
        <p className={classes.chartDates}>All time</p>
      </div>
      {/* @ts-ignore  */}
      <Bar data={data} options={COMMON_LINE_CHART_OPTIONS}/>
    </Card>
  )
}
