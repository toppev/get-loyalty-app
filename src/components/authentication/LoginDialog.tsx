import { LinearProgress, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import LoginForm from './LoginForm';
import { onLoginOrAccountCreate, registerRequest } from "../../services/authenticationService";

interface LoginDialogProps {
    open: boolean
}

export default function LoginDialog({ open }: LoginDialogProps) {

    const appContext = useContext(AppContext);

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleClickNoAccount = async () => {
        setSubmitting(true);
        setError("");
        registerRequest()
            .then((res) => {
                try {
                    onLoginOrAccountCreate(appContext, res);
                } catch (e) {
                    console.log(e)
                    setError(`Oops. Something went wrong. ${e}`)
                }
            })
            .catch(err => {
                console.log("Error creating an account: " + err);
                setError(`${err}. Please try again.`);
            })
            .finally(() => setSubmitting(false));
    };

    return open ? (
        <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogContent>
                <LoginForm/>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={handleClickNoAccount}
                >I don't have an account</Button>
            </DialogActions>
            {error && <Typography align="center" color="error">{error}</Typography>}
            {submitting && <LinearProgress/>}
        </Dialog>
    ) : (null);
}