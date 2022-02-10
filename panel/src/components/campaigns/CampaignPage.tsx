import React, { useState } from "react"
import { Dialog, DialogContent, Grid, LinearProgress, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Campaign } from "./Campaign"
import CampaignPaper from "./CampaignPaper"
import NewButton from "../common/button/NewButton"
import CloseButton from "../common/button/CloseButton"
import CampaignForm, { CampaignFormProps } from "./CampaignForm"
import { deleteCampaign, listCampaigns } from "../../services/campaignService"
import RetryButton from "../common/button/RetryButton"
import useRequest from "../../hooks/useRequest"
import useResponseState from "../../hooks/useResponseState"
import { CampaignTemplatesSelector } from "./CampaignTemplates"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '30px 0px',
      maxWidth: '100%',
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
  }))

export default function () {

  const classes = useStyles()

  const [formCampaign, setFormCampaign] = useState<Campaign | undefined>()
  const [formOpen, setFormOpen] = useState(false)
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false)

  const { error, loading, response, execute: fetchCampaigns } = useRequest(listCampaigns, {})
  const [campaigns] = useResponseState<Campaign[]>(response, [], res => res.data.map((it: any) => new Campaign(it)))
  const otherRequests = useRequest()

  return error ? (
    <RetryButton error={error}/>
  ) : (
    <div>
      <NewButton
        name="New Campaign"
        buttonProps={{
          className: classes.newBtn,
          onClick: () => setTemplateSelectorOpen(true)
        }}
      />
      {(loading || otherRequests.loading) && <LinearProgress/>}
      <Grid className={classes.container} spacing={4} container direction="row" alignItems="flex-start">
        {
          campaigns.length === 0 && !loading &&
          <p className={classes.noCampaigns}>You don't have any campaigns. Create one by clicking the button above.</p>
        }

        {campaigns.map(campaign => (
          <Grid item xs={12} md={6} lg={4} key={campaign.id}>
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
        }}
      />
      <CampaignTemplatesSelector
        open={templateSelectorOpen}
        campaigns={campaigns}
        onClose={() => setTemplateSelectorOpen(false)}
        onSelect={campaign => {
          setTemplateSelectorOpen(false)
          setFormCampaign(campaign)
          setFormOpen(true)
        }}
      />
    </div>
  )
}

interface CampaignFormDialogProps extends CampaignFormProps {
  open: boolean
  onClose: () => any
}

function CampaignFormDialog(props: CampaignFormDialogProps) {

  const classes = useStyles()

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
