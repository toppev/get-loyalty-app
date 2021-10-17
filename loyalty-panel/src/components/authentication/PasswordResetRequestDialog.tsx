import React, { useEffect, useState } from "react"
import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField,
  Theme,
  Typography,
  useTheme
} from "@material-ui/core"
import CloseButton from "../common/button/CloseButton"
import EmailIcon from '@material-ui/icons/Email'
import { post, validBackendURL } from "../../config/axios"
import { isEmail } from "../../util/validate"
import { ensureServerAPI } from "../../services/serverService"
import SendIcon from "@material-ui/icons/Send"

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
            onClick={() => {
              setButtonText('Sending...')
              setButtonDisabled(true)

              const onError = (err: any, errMsg: string = '') => {
                setMessage({
                  message: `An error occurred. ${errMsg}. ${err?.response?.data?.message || '(ErrorCode: ' + (err?.response?.status || -1)})`,
                  color: theme.palette.error.main
                })
                setButtonText('Try again')
                setButtonDisabled(false)
              }

              forgotPassword(email.trim(), window.location.href)
                .then(_res => {
                  setMessage({
                    message: 'We have emailed you a password request link if the email exists.',
                    color: theme.palette.success.main
                  })
                  setButtonText('Email sent!')
                  setTimeout(() => setButtonDisabled(false), 5000) // If they entered wrong email, for example
                })
                .catch(err => onError(err, validBackendURL() ? '' : 'Oops... Could not find your server.'))
            }}
          >{buttonText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


async function forgotPassword(email: string, redirectUrl?: string) {
  await ensureServerAPI(email)
  return post('/user/forgotpassword', { email, redirectUrl })
}
