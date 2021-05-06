import { createStyles, makeStyles, Theme } from "@material-ui/core"

export interface ChartProps {
  title: string
  label: string
}

export const COMMON_LINE_CHART_OPTIONS = {
  scales: {
    yAxes: [{
      ticks: { beginAtZero: true, },
    }],

  },
}

export const useChartStyles = makeStyles((theme: Theme) =>
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
      color: theme.palette.grey[600],
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
      color: theme.palette.grey[500],
      marginTop: '0'
    },
    center: {
      textAlign: 'center'
    },
  }))
