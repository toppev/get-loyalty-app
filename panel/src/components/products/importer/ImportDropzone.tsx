import { Theme } from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import React from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'


interface Props {
  dropzoneOptions: DropzoneOptions,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {},
    dropzone: {
      backgroundColor: '#ede9e8',
      borderStyle: 'groove',
      textAlign: 'center',
      padding: '30px'
    }
  }))


export default function (props: Props) {

  const { getRootProps, getInputProps } = useDropzone({
    ...props.dropzoneOptions
  })

  const classes = useStyles()

  return (
    <section className={classes.container}>
      <div className={classes.dropzone} {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drop the file here or click to select a file</p>
        <CloudUploadIcon/>
        <br/>
        <em>
          (Only *.csv files will be accepted)
          <p>The files will be uploaded and stored</p>
        </em>
      </div>
    </section>
  )
}
