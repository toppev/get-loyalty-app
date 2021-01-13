import React from "react";
import { createStyles, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        text: {
            fontSize: '11px'
        },
        link: {
            textDecorationLine: 'none'
        }
    }));

export default function () {

    const classes = useStyles();

    return (
        <span className={classes.text}>
            See our <a href={'/privacy'} className={classes.link}>privacy policy</a>
        </span>
    )
}