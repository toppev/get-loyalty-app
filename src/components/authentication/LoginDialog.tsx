import { LinearProgress, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import LoginForm from './LoginForm';
import { registerRequest } from "../../services/authenticationService";

interface LoginDialogProps {
    setOpen: (open: boolean) => any
    open: boolean
}

export default function LoginDialog({ open, setOpen }: LoginDialogProps) {

    const appContext = useContext(AppContext);

    const [error, setError] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    const handleClickNoAccount = async () => {
        setSubmitting(true);
        setError("");
        registerRequest()
            .then((res) => {
                appContext.setUser(res.data)
                setOpen(false);
            })
            .catch(err => {
                console.log("Error creating an account: " + err);
                setError(`${err}. Please try again.`);
            })
            .finally(() => setSubmitting(false));
        setOpen(false) // TODO: remove this line
    };

    return open ? (
        <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogContent>
                <LoginForm/>
            </DialogContent>
            <DialogActions>
                <Button
                    variant={document.cookie.includes('session=') ? "text" : "contained"}
                    color="primary"
                    onClick={handleClickNoAccount}
                >I don't have an account</Button>
            </DialogActions>
            {error && <Typography align="center" color="error">{error}</Typography>}
            {submitting && <LinearProgress/>}
        </Dialog>
    ) : (null);
}