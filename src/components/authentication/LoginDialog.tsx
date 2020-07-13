import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import LoginForm from './LoginForm';

interface LoginDialogProps {
    open: boolean
}

export default function LoginDialog({ open }: LoginDialogProps) {

    return open ? (
        <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogContent>
                <LoginForm/>
            </DialogContent>
        </Dialog>
    ) : (null);
}