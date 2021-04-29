import { Button, ButtonProps, createStyles, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    newBtn: {
      backgroundColor: theme.palette.success.main,
    },
  }));

interface NewButtonProps {
  name: string
  buttonProps: ButtonProps
}

export default function (props: NewButtonProps) {

  const classes = useStyles();

  return (
    <div>
      <Button
        variant="contained"
        startIcon={(<AddIcon/>)}
        {...props.buttonProps}
        className={`${classes.newBtn} ${props.buttonProps.className || ""}`}
      >{props.name}</Button>
    </div>
  )
}
