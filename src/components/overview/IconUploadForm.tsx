import React, { useState } from "react";
import { setBusinessIcon } from '../../services/businessService';
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { getBusinessUrl } from "../../config/axios";

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

    const [infoText, setInfoText] = useState('(.ico files only)');

    const classes = useStyles();

    return (
        <div>
            <div className={classes.selectDiv}>
                <p className={classes.text}>Select Icon</p>
                <img src={icon ? URL.createObjectURL(icon) : `${getBusinessUrl()}/icon`} alt="(no icon)"/>
            </div>
            <form
                onSubmit={e => e.preventDefault()}>
                <input
                    type="file"
                    accept=".ico, .png"
                    onChange={e => {
                        e.preventDefault()
                        setIcon(e.target.files?.[0])
                    }}
                />
            </form>
            {icon ?
                <Button
                    className={classes.upload}
                    color="primary"
                    size="small"
                    variant="contained"
                    onClick={() => {
                        setBusinessIcon(icon).then(() => {
                            setIcon(undefined)
                            setInfoText('Icon set!')
                        })
                    }}
                >Upload Icon</Button> : <p>{infoText}</p>
            }
        </div>
    )
}