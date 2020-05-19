import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import React from "react";
import RequestError from "../../../util/requestError";

interface ButtonProps {
    error: RequestError
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

export default function ({ error: errorObject }: ButtonProps) {

    const classes = useStyles();

    const { message, error, retry, clearError } = errorObject;

    return !!errorObject ? (
        <div className={classes.errorDiv}>
            <p className={classes.errorText}>{message}</p>
            <p className={classes.errorName}>{error?.toString()}</p>
            {retry &&
            <Button
                variant="contained"
                color="secondary"
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                    retry()
                    if (clearError) {
                        clearError();
                    }
                }}
                startIcon={<RefreshIcon/>}
                className={classes.retryButton}
            >Retry</Button>
            }
        </div>
    ) : (null);
}