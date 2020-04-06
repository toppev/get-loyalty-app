import { Button, createStyles, Grid, makeStyles, Snackbar, SnackbarContent, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import WarningIcon from '@material-ui/icons/Warning';
import React, { ReactElement } from 'react';

interface Props {
    open: boolean,
    buttonDisabled?: boolean
    onSave: () => any,
    onClose?: Function,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        saveButton: {
            marginLeft: "2px",
        },
        closeMenuButton: {
            marginRight: 'auto',
            marginLeft: 0,
        },
    }));

export default function (props: Props): ReactElement {

    const classes = useStyles();

    return (
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
                    <div>
                        < Button
                            disabled={props.buttonDisabled}
                            variant="contained"
                            color="primary"
                            startIcon={(<SaveIcon />)}
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                props.onSave();
                            }}
                            className={classes.saveButton}
                        > Save</Button >
                    </div>
                }
            />
        </Snackbar>
    )
}