import React, { useEffect, useRef, useState } from "react"
import {
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import CloseButton from "../common/button/CloseButton"
import EmailIcon from '@mui/icons-material/Email'
import { post, validBackendURL } from "../../config/axios"
import { isEmail } from "../../util/validate"
import { ensureServerAPI } from "../../services/serverService"
import SendIcon from "@mui/icons-material/Send"
import ReCAPTCHA from "react-google-recaptcha"

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
  }))

interface PasswordResetRequestDialogProps {
  open: boolean
  onClose: () => any
  initialEmail?: string,
}

export default function (props: PasswordResetRequestDialogProps) {

  const theme = useTheme()
  const classes = useStyles()

  const [email, setEmail] = useState(props.initialEmail || '')
  const [message, setMessage] = useState<{ message: string, color: string } | undefined>()
  const [buttonText, setButtonText] = useState('Email reset link')
  const [buttonDisabled, setButtonDisabled] = useState(false)

  useEffect(() => setButtonDisabled(!isEmail(email)), [email])

  const recaptchaRef = useRef(null)

  const getCaptchaToken = (): Promise<string> => {
    // @ts-ignore
    recaptchaRef.current.reset()
    // @ts-ignore
    return recaptchaRef.current.executeAsync()
  }

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
            <Typography variant="caption" style={{ color: message?.color || '' }}>{message?.message || ''}</Typography>
          </div>
          <Button
            size="small"
            variant="contained"
            disabled={buttonDisabled}
            startIcon={(<SendIcon/>)}
            onClick={async () => {
              setButtonText('Sending...')
              setButtonDisabled(true)

              const onError = (err: any, errMsg: string = '') => {
                setMessage({
                  message: `An error occurred. ${errMsg}. ${err?.response?.data?.message || 'ErrorCode: ' + (err?.response?.status || -1)}`,
                  color: theme.palette.error.main
                })
                setButtonText('Try again')
                setButtonDisabled(false)
                console.log(err)
              }

              const token = await getCaptchaToken()
              let redirectUrl = window.location.href
              if(!redirectUrl.endsWith("/")) redirectUrl += "/"
              if (!redirectUrl.endsWith("/account")) redirectUrl += "account#change-password"
              forgotPassword(email.trim(), token, redirectUrl)
                .then(_res => {
                  setMessage({
                    message: 'We have emailed you a password request link if the email exists.',
                    color: theme.palette.success.main
                  })
                  setButtonText('Email sent!')
                  setTimeout(() => setButtonDisabled(false), 5000) // If they entered wrong email, for example
                })
                .catch(err => onError(err, validBackendURL() ? '' : 'Something went wrong. Please check the email is correct.'))
            }}
          >{buttonText}</Button>
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY!!}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}


async function forgotPassword(email: string, token: string, redirectUrl?: string) {
  await ensureServerAPI(email)
  return post('/user/forgotpassword', { email, token, redirectUrl })
}
