import React, { useState } from "react";
import { createStyles, Dialog, DialogContent, Grid, LinearProgress, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Campaign } from "./Campaign";
import CampaignPaper from "./CampaignPaper";
import NewButton from "../common/button/NewButton";
import CloseButton from "../common/button/CloseButton";
import CampaignForm, { CampaignFormProps } from "./CampaignForm";
import { deleteCampaign, listCampaigns } from "../../services/campaignService";
import RetryButton from "../common/button/RetryButton";
import useRequest from "../../hooks/useRequest";
import useResponseState from "../../hooks/useResponseState";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: '30px'
        },
        newBtn: {
            marginBottom: '15px'
        },
        contentDiv: {
            margin: '10px'
        },
        noCampaigns: {
            color: theme.palette.grey[400],
            margin: '20px'
        }
    }));

export default function () {

    const classes = useStyles();

    const [formCampaign, setFormCampaign] = useState<Campaign | undefined>();
    const [formOpen, setFormOpen] = useState(false);

    const { error, loading, response, execute: fetchCampaigns } = useRequest(listCampaigns, {});
    const [campaigns] = useResponseState<Campaign[]>(response, [], res => res.data.map((it: any) => new Campaign(it)));
    const otherRequests = useRequest();

    return error ? (
        <RetryButton error={error}/>
    ) : (
        <div>
            <NewButton
                name="New Campaign"
                buttonProps={{
                    className: classes.newBtn,
                    onClick: () => {
                        setFormCampaign(undefined)
                        setFormOpen(true)
                    }
                }}
            />
            {(loading || otherRequests.loading) && <LinearProgress/>}
            <Grid className={classes.container} spacing={4} container direction="row" alignItems="flex-start">

                {campaigns.length === 0 &&
                <p className={classes.noCampaigns}>You don't have any campaigns. Create one by clicking the button
                    above.</p>}

                {campaigns.map(campaign => (
                    <Grid item xs={12} md={6} lg={3} key={campaign.id}>
                        <CampaignPaper
                            campaign={campaign}
                            startEditing={() => {
                                setFormCampaign(campaign)
                                setFormOpen(true)
                            }}
                            deleteCampaign={() => {
                                otherRequests.performRequest(
                                    () => deleteCampaign(campaign),
                                    () => fetchCampaigns())
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
            <CampaignFormDialog
                open={formOpen}
                onClose={() => {
                    setFormCampaign(undefined)
                    setFormOpen(false)
                }}
                initialCampaign={formCampaign}
                onSubmitted={_campaign => {
                    setFormOpen(false)
                    fetchCampaigns()
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