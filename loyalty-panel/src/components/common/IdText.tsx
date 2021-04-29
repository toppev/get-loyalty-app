import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";

interface IdTextProps {
  id: string
  text?: string | boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemId: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      color: 'rgba(0,0,0,0.5)',
      fontSize: '0.7em',
      margin: '3px 0px 0px 0px',
      textAlign: 'right',
    },
  }));

export default function ({ id, text }: IdTextProps) {

  const classes = useStyles();

  return (<p className={classes.itemId}>{text === false ? "" : text || "ID:"} {id}</p>)
}
