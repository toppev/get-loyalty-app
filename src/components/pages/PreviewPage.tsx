import { createStyles, Dialog, DialogContent, Link, makeStyles } from "@material-ui/core";
import React from "react";
import CloseButton from "../common/button/CloseButton";
import { API_URL } from "../../config/axios";
import { Page } from "./Page";
import PreviewIframe from "../common/PreviewIframe";

const useStyles = makeStyles(theme =>
    createStyles({
        previewDialogContent: {
            textAlign: 'center',
        },
        explanation: {
            color: theme.palette.grey[700]
        }
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
        <Dialog onClose={onClose} open={open} maxWidth="sm">
            <CloseButton onClick={onClose}/>
            <DialogContent className={classes.previewDialogContent}>
                <h2>Previewing "{page.name}"</h2>
                <p>Performing actions (such as clicking buttons) may not work properly in previews.</p>
                <PreviewIframe src={`${API_URL}/page/${page._id}/html`}/>
                <p className={classes.explanation}>
                    The page has placeholders (the {"{{ stuff }}"} things). They are replaced with dynamic content such as your business
                    information or the customer rewards. The preview has placeholders replaced with information of the
                    <Link target="_blank" rel="noopener" href={"https://demo.getloyalty.app"}> demo </Link>business.
                </p>
                {actions}
            </DialogContent>
        </Dialog>
    )
}