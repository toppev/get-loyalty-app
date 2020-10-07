import { createStyles, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import React from "react";
import CloseButton from "../common/button/CloseButton";
import { API_URL, backendURL } from "../../config/axios";
import { Page } from "./Page";
import PreviewIframe from "../common/PreviewIframe";

const useStyles = makeStyles(() =>
    createStyles({
        previewDialogContent: {
            textAlign: 'center',
            maxWidth: '420px'
        },
    }));


interface PreviewPageProps {
    page: Page | undefined
    onClose: () => any
    open?: boolean
    actions?: JSX.Element
}

export default function PreviewPage({ page, onClose, actions, open = true }: PreviewPageProps) {

    const classes = useStyles();

    return !page ? null : (
        <Dialog onClose={onClose} open={open} maxWidth={false}>
            <CloseButton onClick={onClose}/>
            <DialogContent className={classes.previewDialogContent}>
                <PreviewIframe src={`${API_URL}/page/${page._id}/html`}/>
                <p>
                    Placeholders (the {"{{ stuff }}"} things) do not work in the preview.
                    They are replaced with dynamic content.
                </p>
                {actions}
            </DialogContent>
        </Dialog>
    )
}