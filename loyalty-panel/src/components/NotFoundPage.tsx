import React from "react";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    div: {
      marginLeft: '45px'
    },
    typography: {
      fontSize: '32px'
    },
    text: {
      fontSize: '20px',
      color: theme.palette.grey[500]
    },
  }));

export default function () {

  const classes = useStyles()

  return (
    <div className={classes.div}>
      <Typography className={classes.typography} variant="h2" color="error">Oops... the page was not found</Typography>
      <p className={classes.text}>Check the address bar for typos or find the page in the navigator.</p>
    </div>
  )
}
