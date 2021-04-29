import { createStyles, IconButton, IconButtonProps, makeStyles, Theme } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      color: theme.palette.grey[500],
    },
  }));


export default function (props: IconButtonProps) {

  const classes = useStyles();

  return (
    <IconButton
      {...props}
      className={classes.closeButton}
      aria-label="close">
      <CloseIcon/>
    </IconButton>
  );
}
