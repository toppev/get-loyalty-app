import { Card } from "@material-ui/core"
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
    '> year': { time: dayInMS * 30 * 12, color: 'rgb(58,226,15)' },
    '> 6 months': { time: dayInMS * 30 * 6, color: 'rgb(58,226,15)' },
    '> 3 months': { time: dayInMS * 30 * 3, color: 'rgb(58,226,15)' },
    '> 2 months': { time: dayInMS * 30 * 2, color: 'rgb(77,220,40)' },
    '> month': { time: dayInMS * 30, color: 'rgb(107,219,79)' },
    '> 14 days': { time: dayInMS * 14, color: 'rgb(142,238,37)' },
    '> week': { time: dayInMS * 7, color: 'rgb(235,250,28)' },
    '>= day': { time: dayInMS, color: 'rgb(255,216,0)' },
    'once': { time: -1, color: 'rgb(255,111,88)' },
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
      backgroundColor: Object.values(usageLength).map(it => it.color),
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
      <p className={classes.p} style={{ textAlign: 'center', fontSize: '12px'}}>
        Low usage retention may suggest that your customers like the idea but do not benefit from using the app.
        <br/>
        Maybe a new campaign or rewards would fix that?
      </p>
    </Card>
  )
}
