import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import LoginForm from './LoginForm';
import ReCAPTCHA from "react-google-recaptcha";

interface LoginDialogProps {
    open: boolean
}

export default function LoginDialog({ open }: LoginDialogProps) {

    const recaptchaRef: React.RefObject<ReCAPTCHA> = React.createRef();

    const getCaptchaToken = (): string => {
        // @ts-ignore
        return recaptchaRef.current?.execute()
    }

    return open ? (
        <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogContent>
                <LoginForm
                    getCaptchaToken={getCaptchaToken}
                />
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={process.env.CAPTCHA_SITE_KEY!!}
                />
            </DialogContent>
        </Dialog>
    ) : (null);
}