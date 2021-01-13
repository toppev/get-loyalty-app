import React, { useEffect, useState } from "react";
import { Button, createStyles, Dialog, DialogContent, InputAdornment, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import CloseButton from "../common/button/CloseButton";
import EmailIcon from '@material-ui/icons/Email';
import { post, validBackendURL } from "../../config/axios";
import { isEmail } from "../../util/validate";
import { ensureServerAPI } from "../../services/serverService";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        emailInput: {
            minWidth: '60%'
        },
        input: {
            textAlign: 'center'
        },
        dialog: {
            textAlign: 'center'
        },
        content: {
            padding: '20px 0px'
        },
        paper: {
            margin: '40px'
        }
    }));

interface PasswordResetRequestDialogProps {
    open: boolean
    onClose: () => any
    initialEmail?: string,
}

export default function (props: PasswordResetRequestDialogProps) {

    const classes = useStyles();

    const [email, setEmail] = useState(props.initialEmail || '');
    const [message, setMessage] = useState<string | undefined>();
    const [buttonText, setButtonText] = useState('Email reset link');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => setButtonDisabled(!isEmail(email)), [email])

    return (
        <Dialog open={props.open} fullWidth className={classes.dialog}>
            <CloseButton onClick={props.onClose}/>
            <DialogContent className={classes.content}>
                <Typography variant="h6">Reset Password</Typography>
                <div className={classes.paper}>
                    <TextField
                        className={classes.emailInput}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><EmailIcon/></InputAdornment>
                            ),
                            className: classes.input,
                        }}
                        value={email}
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={classes.paper}>
                    <div>
                        <Typography variant="caption">{message}</Typography>
                    </div>
                    <Button
                        size="small"
                        variant="contained"
                        disabled={buttonDisabled}
                        onClick={() => {
                            setButtonText('Sending...')
                            setButtonDisabled(true)

                            const onError = (err: any, errMsg: string = '') => {
                                setMessage(`An error occurred. ${errMsg}. ${err?.response?.data?.message || `(Code ${err?.response?.status || -1}`})`);
                                setButtonText('Try again')
                                setButtonDisabled(false)
                            }

                            forgotPassword(email.trim())
                                .then(_res => setMessage('We have emailed you a password request link if the email exists.'))
                                .catch(err => onError(err, validBackendURL() ? '' : 'Could not find your server.'))
                        }}
                    >{buttonText}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


async function forgotPassword(email: string) {
    await ensureServerAPI(email)
    return post('/user/forgotpassword', { email })
}