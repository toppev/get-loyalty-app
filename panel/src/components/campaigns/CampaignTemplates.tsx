import React from "react"
import { Box, Button, createStyles, Dialog, DialogContent, makeStyles, Paper, Theme, Typography } from "@material-ui/core"
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
      marginBottom: '25px',
      textAlign: 'center'
    },
    item: {
      marginBottom: '40px',
      padding: '20px'
    },
    description: {
      width: '220px',
      height: '50px',
    }
  }))

interface CampaignTemplatesSelectorProps {
  open: boolean,
  onSelect: (campaign: Campaign) => any
  onClose: () => any
}

export function CampaignTemplatesSelector(props: CampaignTemplatesSelectorProps) {

  const classes = useStyles()

  return (
    <div>
      <Dialog open={props.open} maxWidth="sm" fullWidth onClose={props.onClose}>
        <CloseButton onClick={props.onClose}/>
        <DialogContent>
          <div className={classes.content}>
            <Typography className={classes.title}>
              Select a template to get started
            </Typography>
            <Box display="flex" flexWrap="wrap" alignContent="center" justifyContent="space-around">
              {templateCampaigns.map(it => {
                return (
                  <Paper key={it.name} className={classes.item} elevation={2}>
                    <Typography style={{ fontSize: '20px' }}>{it.name}</Typography>
                    <p className={classes.description}>{it.description}</p>
                    <div style={{ textAlign: 'start' }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => props.onSelect(it.campaign)}
                      >Select</Button>
                    </div>
                  </Paper>
                )
              })}
            </Box>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


type CampaignTemplates = {
  name: string,
  description: string,
  campaign: Campaign
}

const templateCampaigns: CampaignTemplates[] = [{
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
