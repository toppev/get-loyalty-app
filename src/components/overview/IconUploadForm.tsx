import React, { useState } from "react";
import { setBusinessIcon } from '../../services/businessService';
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { backendURL } from "../../config/axios";

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
    }));

export default function () {

    const [icon, setIcon] = useState<File | undefined>();
    const [uploading, setUploading] = useState(false);

    const defaultInfoText = '.png file recommended. JPEG might work :)';
    const [infoText, setInfoText] = useState(defaultInfoText);

    const classes = useStyles();

    return (
        <div>
            <div className={classes.selectDiv}>
                <p className={classes.text}>Select Icon</p>
                <img src={icon ? URL.createObjectURL(icon) : `${backendURL}/business/icon`} alt="(no icon)"
                     width="100px"/>
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
            {icon ?
                <Button
                    disabled={uploading}
                    className={classes.upload}
                    color="primary"
                    size="small"
                    variant="contained"
                    onClick={() => {
                        setUploading(true)
                        setBusinessIcon(icon).then(() => {
                            setUploading(false)
                            setIcon(undefined)
                            setInfoText('Icon set!')
                            setTimeout(() => {
                                setIcon(undefined)
                                setInfoText(defaultInfoText)
                            }, 5000)
                        })
                    }}
                >Upload Icon</Button> : <p style={{ fontSize: '12px' }}>{infoText}</p>
            }
        </div>
    )
}