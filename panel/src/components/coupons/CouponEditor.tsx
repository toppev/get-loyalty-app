import { Coupon } from "./Coupon"
import { Button, Dialog, DialogContent, LinearProgress, Theme, Typography } from "@mui/material"
import CloseButton from "../common/button/CloseButton"
import React, { useState } from "react"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import { Form, Formik, FormikErrors } from "formik"
import RewardManager from "../rewards/RewardManager"
import RetryButton from "../common/button/RetryButton"
import SaveIcon from "@mui/icons-material/Save"
import IdText from "../common/IdText"
import { Campaign } from "../campaigns/Campaign"
import useRequest from "../../hooks/useRequest"
import Reward from "../rewards/Reward"
import { createCoupon, updateCoupon } from "../../services/couponService"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentDiv: {
      margin: '10px'
    },
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
  }))

interface CouponEditorProps {
  open: boolean
  onClose: () => any
  coupon: Coupon
  onSubmitted: (coupon: Coupon) => any
}

export default function CouponEditor(props: CouponEditorProps) {

  const classes = useStyles()

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <CloseButton onClick={props.onClose}/>
      <DialogContent>
        <div className={classes.contentDiv}>
          <CouponForm {...props} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CouponForm({ coupon, ...props }: CouponEditorProps) {

  const classes = useStyles()

  // not formik fields so keep track of them here
  const [reward, setReward] = useState<Reward | undefined>(coupon.reward)
  const [productSelectorOpen, setProductSelectorOpen] = useState(false)

  const { error, loading, performRequest } = useRequest()

  const isEditing = coupon?.id?.length === 24 // if valid id, then we are editing and not creating
  const title = isEditing ? 'Edit Coupon' : 'Create Coupon'

  const mergeCoupons = (newCoupon: Coupon) => {
    // Update categories and other stuff here
    Object.assign(newCoupon, { reward })
    /*
    if (isDates) {
      newCampaign.start = startDate
      newCampaign.end = endDate
    } else {
      newCampaign.start = undefined
      newCampaign.end = undefined
    }
     */
    return newCoupon
  }

  return (
    <div className={classes.paper}>
      <Typography color="primary" component="h1" variant="h4">{title}</Typography>
      <Formik
        initialValues={coupon}
        validate={validate}
        onSubmit={(coupon, actions) => {
          mergeCoupons(coupon)
          performRequest(
            () => isEditing ? updateCoupon(coupon) : createCoupon(coupon),
            () => {
              actions.setSubmitting(false)
              props.onSubmitted(coupon)
            }
          )
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form className={classes.form}>
            {/*
            <TextField
              className={classes.field}
              name=""
              type="text"
              label="Name of this campaign"
              placeholder="Birthday cake!"
            />

              * Might use this later, don't delete
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CustomDatePicker
                  label="Coupon start date (dd/MM/yyyy)"
                  value={startDate}
                  showTodayButton
                  setValue={setStartDate}
                />
                <CustomDatePicker
                  disabled={!isDates}
                  disablePast={!campaign.end}
                  label="Coupon end date (dd/MM/yyyy)"
                  showTodayButton
                  value={endDate}
                  setValue={setEndDate}
                />
              </LocalizationProvider>
            </Box>
               */
            }

            <Typography variant="h6" className={classes.typography}>Reward</Typography>

            <RewardManager
              maxRewards={1}
              rewards={reward ? [reward] : []}
              setRewards={rewards => {
                setReward(rewards[0])
              }}
            />

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

            <IdText id={coupon.id}/>
          </Form>
        )}
      </Formik>
    </div>
  )
}


function validate(values: Coupon): FormikErrors<Coupon> {
  const errors: FormikErrors<Campaign> = {}
  // any validation here
  return errors
}
