import { Button, createStyles, Grid, makeStyles, Snackbar, SnackbarContent, Theme } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import React, { ReactElement, useState } from 'react';

interface Props {
    open: boolean,
    buttonDisabled?: boolean
    onSave: (callback: Function) => any,
    onClose?: Function,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        saveButton: {
            marginLeft: "2px",

        },
    }));

export default function(props: Props): ReactElement {

    const classes = useStyles();

    const [submitting, setSubmitting] = useState(false);

    return props.open ? (
        <div>
            <Snackbar
                open={props.open}
                onClose={() => props.onClose && props.onClose()}
            >
                <SnackbarContent
                    message={
                        <Grid container direction="row" alignItems="center">
                            <Grid item>
                                <WarningIcon color="secondary" />
                            </Grid>
                            <Grid item><p> Careful! You have unsaved changes!</p></Grid>
                        </Grid>
                    }
                    action={
                        < Button
                            disabled={submitting}
                            variant="contained"
                            color="primary"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                setSubmitting(true);
                                props.onSave(() => {
                                    setSubmitting(false);
                                });
                            }}
                            className={classes.saveButton}
                        > Save</Button >
                    }
                />
            </Snackbar>
        </div >
    ) : (<div></div>)
}