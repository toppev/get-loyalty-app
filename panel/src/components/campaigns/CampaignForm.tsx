import allRequirements from "@toppev/getloyalty-campaigns"
import { Campaign, Requirement } from "./Campaign"
import React, { useState } from "react"
import {
  Box,
  Button,
  createStyles,
  FormControlLabel,
  LinearProgress,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
  Typography
} from "@material-ui/core"
import { Form, Formik, FormikErrors } from "formik"
import { TextField } from "formik-material-ui"
import CategorySelector from "../categories/CategorySelector"
import ProductSelector from "../products/ProductSelector"
import SaveIcon from "@material-ui/icons/Save"
import IdText from "../common/IdText"
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import Reward from "../rewards/Reward"
import DateFnsUtils from "@date-io/date-fns"
import SelectProductsButton from "../products/button/SelectProductsButton"
import RequirementSelector from "./RequirementSelector"
import useRequest from "../../hooks/useRequest"
import RetryButton from "../common/button/RetryButton"
import { createCampaign, updateCampaign } from "../../services/campaignService"
import { isAlphanumeric } from "../../util/validate"
import RewardManager from "../rewards/RewardManager"
import { styled } from '@material-ui/styles'
import CustomDatePicker from "../common/CustomDatePicker"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    field: {
      width: '100%',
      margin: '12px 0px'
    },
    submitDiv: {
      margin: '5px',
      textAlign: 'center',
    },
    submitButton: {
      margin: theme.spacing(3, 0, 2),
    },
    typography: {
      margin: '40px 0px 8px 0px',
      color: theme.palette.grey[900]
    },
    tip: {
      color: theme.palette.grey[500]
    },
    catProdDiv: {
      marginTop: '50px'
    },
    newRewardBtn: {},
  }))

export interface CampaignFormProps {
  initialCampaign?: Campaign,
  onSubmitted: (campaign: Campaign) => any
}

const emptyCampaign = new Campaign({ id: "new_campaign", name: "", description: "" })

export default function ({ initialCampaign, onSubmitted }: CampaignFormProps) {

  const classes = useStyles()

  const campaign = initialCampaign || emptyCampaign
  // not formik fields so keep track of them here
  const [categories, setCategories] = useState(campaign.categories)
  const [products, setProducts] = useState(campaign.products)
  const [endRewards, setEndRewards] = useState<Reward[]>(campaign.endReward)
  const [requirements, setRequirements] = useState<Requirement[]>(campaign.requirements)

  const [isDates, setIsDates] = useState<boolean>(!!campaign.start || !!campaign.end)
  const [startDate, setStartDate] = useState<Date | undefined>(campaign.start)
  const [endDate, setEndDate] = useState<Date | undefined>(campaign.end)

  const { error, loading, performRequest } = useRequest()

  const [productSelectorOpen, setProductSelectorOpen] = useState(false)

  const isEditing = initialCampaign?.id?.length === 24 // if valid id, then we are editing and not creating
  const title = isEditing ? 'Edit Campaign' : 'Create Campaign'

  const mergeCampaign = (newCampaign: Campaign) => {
    // Update categories and other stuff here
    Object.assign(newCampaign, { categories, products, endReward: endRewards, requirements })
    if (isDates) {
      newCampaign.start = startDate
      newCampaign.end = endDate
    } else {
      newCampaign.start = undefined
      newCampaign.end = undefined
    }
    return newCampaign
  }

  return (
    <div className={classes.paper}>
      <Typography color="primary" component="h1" variant="h4">{title}</Typography>
      <Formik
        initialValues={campaign}
        validate={validate}
        onSubmit={(campaign, actions) => {
          mergeCampaign(campaign)
          performRequest(
            () => isEditing ? updateCampaign(campaign) : createCampaign(campaign),
            () => {
              actions.setSubmitting(false)
              onSubmitted(campaign)
            }
          )
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form className={classes.form}>
            <TextField
              className={classes.field}
              name="name"
              type="text"
              label="Name of this campaign"
              placeholder="Birthday cake!"
            />
            <TextField
              className={classes.field}
              name="description"
              type="text"
              label="Description of this campaign"
              placeholder="Free cupcake on your birthday!"
            />
            <TextField
              className={classes.field}
              name="transactionPoints"
              type="number"
              label="Transaction Points"
              placeholder="Customer points to receive per purchase"
            />
            <TextField
              className={classes.field}
              name="maxRewards.total"
              type="number"
              label="Total number of rewards"
              placeholder="Maximum number of rewards to give. (Leave empty for unlimited)"
            />
            <TextField
              className={classes.field}
              name="maxRewards.user"
              type="number"
              label="Rewards per user"
              placeholder="Maximum number of rewards per user"
            />
            <TextField
              className={classes.field}
              name="couponCode"
              type="text"
              label="Coupon code (customers can use to gain rewards) (Under development, not working yet!)"
              placeholder="e.g SUMMER2020, STUDENT20 or name of an event. Leave empty for none"
            />

            <Typography variant="h6" className={classes.typography}>Duration & Dates</Typography>
            <RadioGroup name="Dates" value={isDates} onChange={(e, val) => setIsDates(val === "true")}>
              <FormControlLabel
                value="true"
                control={<Radio/>}
                checked={isDates}
                label={<span style={{ color: '#636363' }}>Temporary campaign (ends automatically)</span>}
              />
              <FormControlLabel
                value="false"
                control={<Radio/>}
                checked={!isDates}
                label={<span style={{ color: '#636363' }}>Continuous (no end date)</span>}
              />
            </RadioGroup>
            <Box display="flex" flexWrap="wrap" justifyContent="flex-start" style={{ gap: '25px' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <CustomDatePicker
                  margin="normal"
                  label="Campaign start date (dd/MM/yyyy)"
                  format="dd/MM/yyyy"
                  value={startDate}
                  showTodayButton
                  onChange={date => date && setStartDate(date)}
                />
                <CustomDatePicker
                  disabled={!isDates}
                  disablePast={!campaign.end}
                  margin="normal"
                  label="Campaign end date (dd/MM/yyyy)"
                  format="dd/MM/yyyy"
                  value={endDate}
                  showTodayButton
                  onChange={date => date && setEndDate(date)}
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Typography variant="h6" className={classes.typography}>Campaign Type(s)</Typography>
            <p className={classes.tip}>
              Specify when this campaign is valid. In other words, select requirements
              for this campaign
            </p>
            <RequirementSelector initialRequirements={requirements} onChange={setRequirements}/>

            {requirements.length !== 0 && <p className={classes.tip}>
              Remember to explain the campaign in the description (or in the name). For example, if you
              selected "{allRequirements.stamps.name}", inform the customer that they need to visit X times for the reward.
            </p>}

            <Typography variant="h6" className={classes.typography}>End Rewards</Typography>

            <RewardManager rewards={endRewards} setRewards={setEndRewards}/>

            <div className={classes.catProdDiv}>
              <p className={classes.tip}>
                (Optional) Select which categories or products are eligible.
                If none of the categories/products of this campaign are selected in the scanner app at checkout, the campaign
                will not be triggered (i.e no rewards or advancing).
                <br/>
                <b>Leave empty for all categories and products (recommended).</b>
              </p>
              <CategorySelector
                className={classes.field}
                initialCategories={campaign.categories}
                onCategoriesUpdate={setCategories}
              />
              <SelectProductsButton
                products={products}
                buttonProps={{
                  disabled: isSubmitting,
                  onClick: () => setProductSelectorOpen(true)
                }}
              />
              {productSelectorOpen && <ProductSelector
                open={productSelectorOpen}
                onClickClose={() => setProductSelectorOpen(false)}
                onSubmit={products => {
                  setProducts(products)
                  setProductSelectorOpen(false)
                }}
                text="Select products that are included in the campaign"
              />}
            </div>

            <RetryButton error={error}/>

            <div className={classes.submitDiv}>
              <Button
                className={classes.submitButton}
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={(<SaveIcon/>)}
                onClick={submitForm}
              >Save</Button>
              {loading && <LinearProgress/>}
            </div>

            <IdText id={campaign.id}/>
          </Form>
        )}
      </Formik>
    </div>
  )
}

function validate(values: Campaign): FormikErrors<Campaign> {
  const errors: FormikErrors<Campaign> = {}
  if (!values.name.trim().length) {
    errors.name = 'Name can not be empty.'
  }
  if (values.transactionPoints && values.transactionPoints < 0) {
    errors.transactionPoints = 'Points per purchase can not be negative.'
  }
  if (values.couponCode && !isAlphanumeric(values.couponCode)) {
    errors.couponCode = 'The code must be alphanumeric. Allowed characters: numbers, letters (a-z or A-Z), underscore ("_") and hyphen ("-").'
  }
  return errors
}
