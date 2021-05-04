import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    p: {
      fontSize: '14px',
      color: theme.palette.grey[600]
    },
  }))


export default function () {

  const classes = useStyles()

  return (
    <div>
      <p className={classes.p}>
        Work in progress
      </p>
    </div>
  )
}
