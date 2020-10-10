import React, { useEffect, useState } from "react";
import {
    Button,
    createStyles,
    Dialog,
    DialogContent,
    InputAdornment,
    makeStyles,
    TextField,
    Theme,
    Typography
} from "@material-ui/core";
import CloseButton from "../common/button/CloseButton";
import EmailIcon from '@material-ui/icons/Email';
import { post } from "../../config/axios";
import { isEmail } from "../../util/validate";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        emailInput: {},
        input: {},
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
    const [buttonText, setButtonText] = useState('Reset Password');
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
                        variant="contained"
                        disabled={buttonDisabled}
                        onClick={() => {
                            setButtonText('Sending...')
                            setButtonDisabled(true)
                            forgotPassword(email).then(_res => {
                                setMessage('We have emailed you a password request link if the email exists.')
                            }).catch(() => {
                                setMessage('An error occurred.');
                                setButtonText('Try again')
                                setButtonDisabled(false)
                            })
                        }}
                    >{buttonText}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


function forgotPassword(email: string) {
    return post('/user/forgotpassword', { email })
}