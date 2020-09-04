import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import LoginForm from './LoginForm';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface LoginDialogProps {
    open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialogRoot: {
            [theme.breakpoints.down('xs')]: {
                minWidth: '95%'
            }
        },
    }));

export default function LoginDialog({ open }: LoginDialogProps) {

    const classes = useStyles();

    return open ? (
        <Dialog open={open} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogRoot }}>
            <DialogContent>
                <LoginForm/>
            </DialogContent>
        </Dialog>
    ) : null
}