import React, { useState } from "react"
import { setBusinessIcon } from '../../services/businessService'
import { Button, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { backendURL } from "../../config/axios"
import { Alert } from '@mui/material'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectDiv: {
      paddingTop: '15px',
      paddingBottom: '10px'
    },
    text: {
      fontSize: '18px'
    },
    upload: {
      marginTop: '10px'
    }
  }))

export default function IconUploadForm() {

  const [icon, setIcon] = useState<File | undefined>()
  const [uploading, setUploading] = useState(false)

  const [message, setMessage] = useState<undefined | { message: string, severity: "error" | "success" }>()

  const classes = useStyles()

  return (
    <div>
      <div className={classes.selectDiv}>
        <p className={classes.text}>Upload your icon</p>
        <img src={icon ? URL.createObjectURL(icon) : `${backendURL}/business/icon`} alt="(no icon)" width="100px"/>
      </div>
      <form
        onSubmit={e => e.preventDefault()}>
        <input
          type="file"
          accept=".png, .jpeg, .jpg, .svg"
          onChange={e => {
            e.preventDefault()
            setIcon(e.target.files?.[0])
          }}
        />
      </form>
      {message && <Alert style={{ marginTop: '10px', maxWidth: '250px' }} severity={message.severity}>{message.message}</Alert>}

      {icon &&
        <Button
          disabled={uploading}
          className={classes.upload}
          color="primary"
          size="small"
          variant="contained"
          onClick={() => {
            setUploading(true)
            setBusinessIcon(icon)
              .then(() => {
                setMessage({ message: "Icon uploaded successfully!", severity: "success" })
                setIcon(undefined)
                setTimeout(() => {
                  setMessage(undefined)
                }, 5000)
              })
              .catch(err => {
                setMessage({ message: `Error: ${err?.data?.message || "please try a .png file"}`, severity: "error" })
              })
              .finally(() => {
                setUploading(false)
              })
          }}
        >Upload Icon</Button>
      }
      <p style={{ fontSize: '12px' }}>PNG (.png) file recommended</p>
    </div>
  )
}
