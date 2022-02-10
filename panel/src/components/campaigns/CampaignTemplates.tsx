import React from "react"
import { Box, Button, Dialog, DialogContent, Divider, Paper, Theme, Typography } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import CloseButton from "../common/button/CloseButton"
import { Campaign } from "./Campaign"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      minHeight: '120px',
    },
    title: {
      fontSize: '18px',
      color: theme.palette.grey[700],
      textAlign: 'center',
      margin: '5px 0'
    },
    item: {
      marginBottom: '20px',
      padding: '20px'
    },
    description: {
      width: '220px',
      height: '50px',
    }
  }))

interface CampaignTemplatesSelectorProps {
  open: boolean,
  campaigns: Campaign[]
  onSelect: (campaign: Campaign) => any
  onClose: () => any
}

export function CampaignTemplatesSelector(props: CampaignTemplatesSelectorProps) {

  const classes = useStyles()

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth onClose={props.onClose}>
      <CloseButton onClick={props.onClose}/>
      <DialogContent>
        <div className={classes.content}>
          <Typography className={classes.title}>
            Select a campaign template
          </Typography>
          <Templates onSelect={props.onSelect} campaigns={templateCampaigns}/>
          <Divider style={{ margin: '10px 0' }}/>
          {props.campaigns.length > 0 &&
            <>
              <Typography className={classes.title}>or clone an existing campaign</Typography>
              <Templates onSelect={props.onSelect} campaigns={props.campaigns.map(it => {

                const clonedCampaign = JSON.parse(JSON.stringify(it))
                delete clonedCampaign.id
                clonedCampaign.name = `Copy of "${it.name}"`

                return {
                  name: it.name,
                  description: it.description,
                  campaign: clonedCampaign
                }
              })}/>
            </>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

type TemplatesProps = { campaigns: CampaignTemplate[], onSelect: (campaign: Campaign) => any };

function Templates({ campaigns, onSelect }: TemplatesProps) {

  const classes = useStyles()

  return (
    <Box display="flex" flexWrap="wrap" alignContent="center" justifyContent="space-around">
      {campaigns.map(campaign => (
        <Paper key={campaign.name} className={classes.item} elevation={2}>
          <Typography style={{ fontSize: '20px' }}>{campaign.name}</Typography>
          <p className={classes.description}>{campaign.description}</p>
          <div style={{ textAlign: 'start' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onSelect(campaign.campaign)}
            >Select</Button>
          </div>
        </Paper>
      ))}
    </Box>
  )
}

type CampaignTemplate = {
  name: string,
  description: string,
  campaign: Campaign
}

const templateCampaigns: CampaignTemplate[] = [{
  name: 'New Campaign',
  description: 'Create a campaign from scratch.',
  campaign: new Campaign(
    { id: "new_campaign", name: "", description: "" }
  )
}, {
  name: 'Every 5th Free',
  description: '"stamp card" campaign. 5 visits for a free coffee.',
  campaign: new Campaign(
    {
      "name": "Every 5th Free",
      "description": "Visit 5 times for a free cup of coffee",
      "products": [],
      "categories": [],
      "requirements": [{ "type": "stamps", "values": [5] }],
      "maxRewards": { "user": -1 },
      "transactionPoints": 50,
      "endReward": [{
        "id": "new_reward_506",
        "name": "Free Coffee",
        "itemDiscount": "Free",
        "description": "",
        "customerPoints": "",
        "products": [],
        "categories": []
      }]
    }
  )
}]
