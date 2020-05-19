import { createStyles, Dialog, DialogContent, IconButton, makeStyles, Theme } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import React from "react";
import RewardForm, { RewardFormProps } from "./RewardForm";


export interface RewardFormDialogProps extends RewardFormProps {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLElement>) => void,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        closeButton: {
            position: 'absolute',
            color: theme.palette.grey[500],
        },
    }));

export default function (props: RewardFormDialogProps) {

    const classes = useStyles();
    return (
        <div>
            <Dialog open={props.open}>
                <IconButton className={classes.closeButton} aria-label="close" onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
                <DialogContent>
                    <RewardForm {...props} />
                </DialogContent>
            </Dialog>
        </div>
    );
}