import { LinearProgress, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useContext } from 'react';
import { post } from '../config/axios';
import AppContext from '../context/AppContext';
import { LoginForm } from './LoginForm';

export default function LoginDialog() {

    const appContext = useContext(AppContext);

    const [open, setOpen] = React.useState(!appContext.loggedIn);
    const [error, setError] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    const handleClickNoAccount = async () => {
        setSubmitting(true);
        setError("");
        post('/user/register', {})
            .then((data) => {
                setOpen(false);
            }).catch(err => {
                console.log("Error when creating an account: " + err);
                setError(`${err}. Please try again.`);
                // TODO REMOVE
                setOpen(false);
            }).finally(() => {
                setSubmitting(false);
            });
    };

    return open ? (
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <LoginForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickNoAccount} color="primary">Try without an account</Button>
                </DialogActions>
                {error && <Typography align="center" color="error">{error}</Typography>}
                {submitting && <LinearProgress />}
            </Dialog>
        </div>
    ) : (null);
}