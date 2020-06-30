import { SketchPicker } from "react-color"
import React, { useState } from "react";
import { createStyles, Dialog, DialogContent, DialogProps, makeStyles, Theme } from "@material-ui/core";
import CloseButton from "./button/CloseButton";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialog: {
        },
    }));

interface ColorPickerProps {
    open: boolean
    initialColor: string
    onChange: (color: string) => any
}

export default function (props: ColorPickerProps) {

    const [color, setColor] = useState(props.initialColor);

    const classes = useStyles();

    return (
        <Dialog open={props.open} onBackdropClick={() => props.onChange(color)} className={classes.dialog}>
            <CloseButton onClick={() => props.onChange(color)}/>
            <DialogContent>
                <SketchPicker color={color} onChange={(v) => setColor(v.hex)}/>
            </DialogContent>
        </Dialog>
    )
}