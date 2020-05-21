import { createStyles, Dialog, DialogContent, makeStyles, Theme } from "@material-ui/core";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import CloseButton from "../common/button/CloseButton";
import { BASE_URL } from "../../config/axios";
import { Page } from "./Page";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        previewDialogContent: {
            textAlign: 'center',
            maxWidth: '420px'
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

    const appContext = useContext(AppContext);

    return !page ? (
        null
    ) : (
        <Dialog onClose={onClose} open={open} maxWidth={false}>
            <CloseButton onClick={onClose}/>
            <DialogContent className={classes.previewDialogContent}>
                <iframe title="Page Preview"
                        src={`${BASE_URL}/business/${appContext.business._id}/page/${page._id}/html`} height={640}
                        width={360}/>
                {actions}
            </DialogContent>
        </Dialog>
    )
}