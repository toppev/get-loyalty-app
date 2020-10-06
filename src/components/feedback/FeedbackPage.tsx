import React from "react";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            fontSize: '22px',
            color: theme.palette.grey[200],
        },
        text: {
            color: theme.palette.grey[200],
        },
        openSource: {
            fontSize: '12px',
            color: theme.palette.info.dark,
            marginTop: '40px',
        },
        githubIcon: {
            marginRight: '12px',
            color: 'initial'
        }
    }));


export default function () {

    const classes = useStyles();

    return (
        <div>
            <Typography className={classes.title} variant="h1">Your feedback is valuable</Typography>
            <p className={classes.text}>
                Help me improve your and your customers' experience by suggesting new ideas and reporting any problems
                or bugs encountered!
            </p>

            // TODO: bug report/feedback forms
            {/*

            <div className={classes.openSource}>
                <Link
                    className={classes.githubIcon}
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/toppev/"
                >
                    <GitHubIcon/>
                </Link>
                Some of the stuff is open source.
            </div>

            */}
        </div>
    )
}