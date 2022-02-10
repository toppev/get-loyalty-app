import { Card } from "@mui/material"
import { Bar } from "react-chartjs-2"
import React from "react"
import { ChartProps, COMMON_LINE_CHART_OPTIONS, useChartStyles } from "./ChartConsts"

interface RetentionChartProps extends ChartProps {
  joinLastDiff: number[]
}

export function UsageLengthChart(props: RetentionChartProps) {

  const classes = useChartStyles()

  const dayInMS = 1000 * 60 * 60 * 24
  const usageLength = {
    '> year': { time: dayInMS * 30 * 12 },
    '> 6 months': { time: dayInMS * 30 * 6 },
    '> 3 months': { time: dayInMS * 30 * 3 },
    '> 2 months': { time: dayInMS * 30 * 2 },
    '> month': { time: dayInMS * 30 },
    '> 14 days': { time: dayInMS * 14 },
    '> week': { time: dayInMS * 7 },
    '>= day': { time: dayInMS },
    'once': { time: -1 },
  }
  const usageLengthGroup = new Array(Object.keys(usageLength).length).fill(0)

  props.joinLastDiff.forEach(diff => {
    Object.values(usageLength).some((val, index) => {
      if (diff > val.time) {
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
      backgroundColor: Array(Object.keys(usageLength).length).fill('rgb(255,111,88)'),
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
      <p className={classes.p} style={{ textAlign: 'center', fontSize: '12px' }}>
        Low usage retention may suggest that your customers like the idea but do not benefit from using the app.
        <br/>
        Maybe a new campaign or rewards would fix that?
      </p>
    </Card>
  )
}
