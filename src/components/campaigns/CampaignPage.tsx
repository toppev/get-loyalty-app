import React, { useState } from "react";
import { createStyles, Dialog, DialogContent, Grid, LinearProgress, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Campaign } from "./Campaign";
import CampaignPaper from "./CampaignPaper";
import NewButton from "../common/button/NewButton";
import CloseButton from "../common/button/CloseButton";
import CampaignForm, { CampaignFormProps } from "./CampaignForm";
import { listCampaigns, updateCampaign } from "../../services/campaignService";
import RetryButton from "../common/button/RetryButton";
import useRequest from "../../hooks/useRequest";
import useResponseState from "../../hooks/useResponseState";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {},
        newBtn: {
            marginBottom: '15px'
        },
        contentDiv: {
            margin: '10px'
        }
    }));

export default function () {

    const classes = useStyles();

    const [formCampaign, setFormCampaign] = useState<Campaign | undefined>();
    const [formOpen, setFormOpen] = useState(false);

    const { error, loading, response } = useRequest(listCampaigns, {});
    const [campaigns, setCampaigns] = useResponseState<Campaign[]>(response, []);

    return error ? (
        <RetryButton error={error}/>
    ) : (
        <div>
            <NewButton
                name="New Campaign"
                buttonProps={{
                    className: classes.newBtn,
                    onClick: () => setFormOpen(true)
                }}
            />
            <Grid className={classes.container} container direction="row" alignItems="flex-start">
                {campaigns.map(campaign => (
                    <Grid item xs={12} md={6} key={campaign.id}>
                        <CampaignPaper campaign={campaign}/>
                    </Grid>
                ))}
            </Grid>
            <CampaignFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                initialCampaign={formCampaign}
                onSubmitted={campaign => {
                    setFormOpen(false)
                    setCampaigns([...campaigns.filter(c => c.id !== campaign.id), campaign])
                }}/>
        </div>
    )
}

interface CampaignFormDialogProps extends CampaignFormProps {
    open: boolean
    onClose: () => any
}

function CampaignFormDialog(props: CampaignFormDialogProps) {

    const classes = useStyles();

    return (
        <Dialog open={props.open} maxWidth="md">
            <CloseButton onClick={props.onClose}/>
            <DialogContent>
                <div className={classes.contentDiv}>
                <CampaignForm {...props} />
                </div>
            </DialogContent>
        </Dialog>
    )
}