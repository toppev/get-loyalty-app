import React from "react"
import { createStyles, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    yes: {
      color: theme.palette.success.main
    },
    no: {
      color: theme.palette.error.main
    },
    expired: {
      color: theme.palette.error.main
    }
  }))

interface YesNoProps {
  state?: boolean
}

export function YesNo({ state }: YesNoProps) {
  const classes = useStyles()
  return state ? (<span className={classes.yes}>Yes</span>) : (<span className={classes.no}>No</span>)
}

interface ExpiredProps {
  date?: Date|string
  alt?: string
}

export function DateExpired({ date, alt }: ExpiredProps) {
  // @ts-ignore hacky but sometimes this is string .-.
  date = new Date(date)

  const classes = useStyles()

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const expired = date && now > date

  return expired ? (<span className={classes.expired}>{date?.toDateString()} (expired)</span>)
    : (<span>{date?.toDateString() || alt}</span>)
}

export function plural(text: string, amount: any) {
  if ((amount.length !== undefined && amount.length !== 1) || (typeof amount === "number" && amount !== 1)) {
    return text + "s"
  }
  return text
}

export function format(text: string | undefined, args: any[] = []) {
  return text?.replace(/{(\d+)}/g, function (match, number) {
    return args[number] ? args[number] : match
  })
}

export function ellipsis(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength)}...`
  }
  return str
}
