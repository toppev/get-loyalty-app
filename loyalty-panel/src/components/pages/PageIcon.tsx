import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import DOMPurify from 'dompurify';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconPreview: {
      '& *': {
        height: '40px'
      }
    },
  }));

interface PageIconProps {
  icon: string
}

export default function ({ icon: dirtyIcon }: PageIconProps) {

  const classes = useStyles();

  // Sanitize to protect admins viewing the page
  const icon = DOMPurify.sanitize(dirtyIcon);

  return (
    <p className={classes.iconPreview} dangerouslySetInnerHTML={{ __html: icon }}/>
  )
}
