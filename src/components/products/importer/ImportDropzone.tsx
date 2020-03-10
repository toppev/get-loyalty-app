import { createStyles, makeStyles, Theme } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';


interface Props {
    dropzoneOptions: DropzoneOptions,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
  
        },
        dropzone: {
            backgroundColor: '#ede9e8',
            borderStyle: 'groove',
            textAlign: 'center',
            padding: '30px'
        }
    }));


export default function (props: Props) {

    const { getRootProps, getInputProps } = useDropzone({
        ...props.dropzoneOptions
    });

    const classes = useStyles();

    return (
        <section className={classes.container}>
            <div className={classes.dropzone} {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop the file here or click to select a file</p>
                <CloudUploadIcon />
                <br />
                <em>
                    (Only *.csv files will be accepted)
                    <p>The files will be uploaded and stored</p>
                </em>
            </div>
        </section>
    )
}