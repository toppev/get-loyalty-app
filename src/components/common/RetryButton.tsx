import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import React from "react";

interface ButtonProps {
    callback: Function,
    error: string
    message?: "An error occurred while loading the page"
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        retryButton: {
            margin: '20px'
        },
        errorDiv: {
            margin: 'auto',
            width: '50%',
            textAlign: 'center',
        },
        errorText: {
            color: 'red'
        },
        errorName: {
            color: 'lightcoral'
        }
    }));

export default function (props: ButtonProps) {

    const classes = useStyles();

    return (
        <div className={classes.errorDiv}>
            <p className={classes.errorText}>{props.message}</p>
            <p className={classes.errorName}>{props.error}</p>
            <Button
                variant="contained"
                color="secondary"
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                    props.callback()
                }}
                startIcon={<RefreshIcon />}
                className={classes.retryButton}
            >Retry</Button >
        </div >
    );
}