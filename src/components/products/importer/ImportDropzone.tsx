import { createStyles, makeStyles, Theme } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';


interface Props {
    dropzoneOptions: DropzoneOptions,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {

        },
        dropzone: {
            borderStyle: 'groove',
            textAlign: 'center',
            padding: '40px'
        }
    }));


export default function (props: Props) {

    const { acceptedFiles, rejectedFiles, getRootProps, getInputProps } = useDropzone({
        ...props.dropzoneOptions
    });

    const AcceptedFilesItems = () => {
        return acceptedFiles.length ? (
            <>
                <h4>Accepted File(s) ({acceptedFiles.length})</h4>
                <ul>
                    {acceptedFiles.map(file => (
                        <li key={file.name}>{file.name} ({(file.size / 1000).toFixed(1)} kB)</li>
                    ))}
                </ul>
            </>
        ) : null;
    }

    // The file name accepting/rejecting might not work that well on all browsers
    // https://github.com/react-dropzone/react-dropzone/tree/master/examples/accept#browser-limitations
    const RejectedFilesItems = () => {
        return rejectedFiles.length ? (
            <>
                <h4>Rejected File(s) ({rejectedFiles.length})</h4>
                <ul>
                    {rejectedFiles.map(file => (
                        <li key={file.name}>{file.name} - {file.size} bytes</li>
                    ))}
                </ul>
            </>
        ) : null;
    }

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
            <aside>
                <ul>
                    <AcceptedFilesItems />
                </ul>
                <ul>
                    <RejectedFilesItems />
                </ul>
            </aside>
        </section>
    )
}