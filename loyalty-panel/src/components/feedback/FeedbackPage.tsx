import React from "react";
import { createStyles, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import GitHubIcon from '@material-ui/icons/GitHub';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            fontSize: '28px',
            color: theme.palette.grey[300],
        },
        text: {
            fontSize: '16px',
            color: theme.palette.grey[400],
        },
        openSource: {
            fontSize: '12px',
            marginTop: '40px',
        },
        githubIcon: {
            marginRight: '12px',
            color: 'initial'
        },
        email: {
            color: theme.palette.info.dark,
            textDecoration: 'none'
        }
    }));


const EMAIL = "support@getloyalty.app"

export default function () {

    const classes = useStyles();

    return (
        <div>
            <Typography className={classes.title} variant="h1">Your feedback is valuable</Typography>
            <p className={classes.text}>
                Help me improve your and your customers' experience by suggesting new ideas and reporting any problems
                or bugs encountered!
            </p>

            <p className={classes.text}>
                You can also email us <a className={classes.email} href={`mailto:${EMAIL}?subject=Feedback`}>{EMAIL}</a>
            </p>

            <iframe
                title="Feedback form"
                src="https://docs.google.com/forms/d/e/1FAIpQLSfqMVzm-5Zim4Ly0NqKSKYMWr-oh39yDzn6Zx9-ogSrGPvKqg/viewform?embedded=true"
                width="640"
                height="720"
                style={{
                    backgroundColor: 'aliceblue',
                    border: 'none'
                }}
            >Loading forms…
            </iframe>

            <div className={`${classes.openSource} ${classes.text}`}>
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

        </div>
    )
}