import React, { useState } from 'react'
import { useDropzone } from "react-dropzone"
import { uploadPageStaticFile } from "../../services/pageService"
import { Button, Dialog, DialogContent, LinearProgress, Theme } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import CloseButton from "./button/CloseButton"
import RetryButton from "./button/RetryButton"
import useRequest from "../../hooks/useRequest"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropzone: {
      backgroundColor: '#ede9e8',
      borderStyle: 'groove',
      textAlign: 'center',
      padding: '30px'
    }
  }))


interface ImageSelectorProps {
  // So we can later view the previously uploaded icons here using this as a "directory"
  prefix: string
  open: boolean
  onClose: () => any
  onSelect: (url: String) => any
  toSize: { width: number, height: number }
}

const acceptedFiles = [".png"]

export default function ImageSelector(props: ImageSelectorProps) {

  const classes = useStyles()

  const { error, loading, performRequest } = useRequest()

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: acceptedFiles,
    onDropAccepted: ([file], _event) => {
      performRequest(
        () => uploadPageStaticFile("common", `${props.prefix}/upload_${Date.now()}`, file, { toSize: props.toSize }),
        res => {
          const { data } = res.data
          const [url] = data
          props.onClose()
          props.onSelect(url)
        })
    }
  })

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth onClose={props.onClose}>
      <CloseButton onClick={props.onClose}/>
      <DialogContent>
        <div>
          {/* TODO: list existing uploads */}
        </div>
        <div>
          <div className={classes.dropzone} {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Click or drop a file to upload ({acceptedFiles.join(", ")})</p>
            <CloudUploadIcon/>
          </div>
        </div>
        <div>
          <RetryButton error={error}/>
          {loading && <LinearProgress/>}
        </div>
      </DialogContent>
    </Dialog>
  )

}

interface ImageSelectorButtonProps extends Omit<ImageSelectorProps, "open" | "onClose"> {
  name: string
  currentPreviewUrl?: string
}

export function ImageSelectorButton(props: ImageSelectorButtonProps) {

  const [open, setOpen] = useState(false)

  return (
    <div>

      <div>
        <img src={props.currentPreviewUrl} alt="(no media)" width="100px"/>
      </div>

      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpen(true)}
      >{props.name}</Button>

      <ImageSelector
        open={open}
        onClose={() => setOpen(false)}
        {...props}
      />
    </div>
  )
}
