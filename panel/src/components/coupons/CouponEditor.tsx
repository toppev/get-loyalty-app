import { Coupon } from "./Coupon"
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress, Radio,
  RadioGroup, Slider, Stack,
  Theme,
  Typography
} from "@mui/material"
import CloseButton from "../common/button/CloseButton"
import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import { Form, Formik, FormikErrors } from "formik"
import RewardManager from "../rewards/RewardManager"
import RetryButton from "../common/button/RetryButton"
import SaveIcon from "@mui/icons-material/Save"
import IdText from "../common/IdText"
import { Campaign } from "../campaigns/Campaign"
import useRequest from "../../hooks/useRequest"
import { createCoupon, updateCoupon } from "../../services/couponService"
import { plural } from "../common/StringUtils"
import { ImageSelectorButton } from "../common/ImageSelector"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentDiv: {
      margin: '10px'
    },
    paper: {
      marginTop: theme.spacing(1),
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
    field: {
      width: '80%',
      margin: '10px 0px'
    },
  }))

const DAY_MS = 1000 * 60 * 60 * 24

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

  const { error, loading, performRequest } = useRequest()

  const isEditing = coupon?.id?.length === 24 // if valid id, then we are editing and not creating
  const title = isEditing ? 'Edit Coupon' : 'Create Coupon'

  const expirationText = (min: number, max: number) => {
    const minDays = min / DAY_MS
    const maxDays = max / DAY_MS
    const isSameValue = minDays === maxDays
    if (isSameValue) {
      return "Always " + minDays + plural(" day", minDays)
    }
    return "Random from " + minDays + " to " + maxDays + "days"
  }

  return (
    <div className={classes.paper}>
      <Typography color="primary" component="h1" variant="h4">{title}</Typography>
      <Formik
        initialValues={coupon}
        validate={validate}
        onSubmit={(coupon, actions) => {
          performRequest(
            () => isEditing ? updateCoupon(coupon) : createCoupon(coupon),
            () => {
              actions.setSubmitting(false)
              props.onSubmitted(coupon)
            }
          )
        }}
      >
        {formik => {
          const { submitForm, values, setFieldValue } = formik
          return (
            <Form className={classes.form}>

              <FormControl component="fieldset">
                <FormLabel component="legend">Status</FormLabel>
                <RadioGroup
                  name="status"
                  value={values.status?.toString() || "active"}
                  onChange={e => setFieldValue("status", e.target.value)}
                >
                  <FormControlLabel value="active" control={<Radio/>} label={(<>Active</>)}/>
                  <FormControlLabel value="paused" control={<Radio/>} label={(<>Paused</>)}/>
                </RadioGroup>
                <div style={{ fontSize: '12px', color: 'gray', margin: '10px 0' }}>
                  <b>Paused </b>coupons are not immediately revoked. Instead, the system will wait for their expiration and will no longer
                  select these coupons.
                </div>
              </FormControl>

              <Typography variant="h6" className={classes.typography}>Probability Modifier</Typography>

              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <span>Low Probability</span>
                <Slider
                  step={0.01}
                  min={0.01}
                  max={1}
                  value={values.probabilityModifier}
                  valueLabelDisplay="auto"
                  onChange={(e, v) => setFieldValue("probabilityModifier", v)}
                />
                <span>High Probability</span>
              </Stack>

              <Typography variant="h6" className={classes.typography}>Expiration Range</Typography>

              <Slider
                step={DAY_MS}
                min={DAY_MS}
                max={DAY_MS * 40}
                valueLabelFormat={(millis, i) => {
                  const days = millis / (DAY_MS)
                  const isSameValue = values.expiration.min === values.expiration.max
                  const prefix = i === 0 ? "from " : "to "
                  return (isSameValue ? "always " : prefix) + days.toFixed() + plural(" day", days)
                }}
                value={[values.expiration.min, values.expiration.max]}
                valueLabelDisplay="auto"
                onChange={(e, v) => {
                  const [min, max] = v as number[]
                  // Always min <= max
                  setFieldValue("expiration.min", min)
                  setFieldValue("expiration.max", max)
                }}
                marks={[
                  { value: DAY_MS, label: "24 hours" },
                  { value: DAY_MS * 7, label: "7 days" },
                  { value: DAY_MS * 14, label: "14 days" },
                  { value: DAY_MS * 30, label: "30 days" }
                ]}
              />

              <div>
                {expirationText(values.expiration.min, values.expiration.max)}
              </div>

              <Typography variant="h6" className={classes.typography}>Reward</Typography>

              <RewardManager
                maxRewards={1}
                rewards={values.reward ? [values.reward] : []}
                setRewards={rewards => {
                  setFieldValue('reward', rewards[0])
                }}
              />

              <ImageSelectorButton
                name="Select Image"
                prefix="coupon_media"
                toSize={{ width: 320, height: 120 }}
                currentPreviewUrl={values.mediaUrls?.[0]}
                onSelect={url => {
                  setFieldValue('mediaUrls', [url])
                }}
              />

              <RetryButton error={error}/>

              <div className={classes.submitDiv}>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  disabled={loading || !values.reward}
                  startIcon={(<SaveIcon/>)}
                  onClick={submitForm}
                >Save</Button>
                {loading && <LinearProgress/>}
              </div>

              <IdText id={coupon.id}/>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}


function validate(values: Coupon): FormikErrors<Coupon> {
  const errors: FormikErrors<Campaign> = {}
  // any validation here
  return errors
}
