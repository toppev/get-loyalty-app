import { CustomerLevel } from "../../../context/AppContext"
import { Button, Dialog, DialogContent, Theme, Typography } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, { useState } from "react"
import CloseButton from "../../common/button/CloseButton"
import { Formik, FormikErrors } from "formik"
import { TextField } from "formik-material-ui"
import Reward from "../../rewards/Reward"
import RewardManager from "../../rewards/RewardManager"
import ColorPicker from "../../common/ColorPicker"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formDiv: {
      padding: '10px'
    },
    field: {
      width: '80%',
      margin: '10px 0px'
    },
    saveDiv: {
      textAlign: 'center',
      marginTop: '10px',
      marginBottom: '2px',
    },
    colorPickerBtn: {
      margin: '12px 0px'
    },
    typography: {
      color: theme.palette.grey[700]
    }
  }))

interface CustomerLevelProps {
  open: boolean
  onClose: () => any
  initialLevel: CustomerLevel
  currentLevels: CustomerLevel[]
  onSubmit: (level: CustomerLevel, setSubmitting: (b: boolean) => any) => any
}

export default function ({ initialLevel, onSubmit, onClose, currentLevels }: CustomerLevelProps) {

  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [levelColor, setLevelColor] = useState(initialLevel.color || '#aaaaaa')
  const [rewards, setRewards] = useState<Reward[]>(initialLevel.rewards || [])

  const classes = useStyles()

  const validate = (value: CustomerLevel) => {
    const errors: FormikErrors<CustomerLevel> = {}
    if (!value.name) {
      errors.name = 'Name must be specified'
    }
    if (value.requiredPoints === undefined) {
      errors.requiredPoints = 'Points must be specified'
    } else if (currentLevels.some(it => it.requiredPoints === value.requiredPoints && it._id !== initialLevel._id)) {
      errors.requiredPoints = `A level with ${value.requiredPoints} points already exists!`
    }
    return errors
  }

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <CloseButton onClick={onClose}/>
      <DialogContent>
        <Formik
          initialValues={initialLevel}
          validateOnChange
          enableReinitialize
          validate={validate}
          onSubmit={(values, actions) => {
            Object.assign(values, { rewards: rewards, color: levelColor })
            onSubmit(values, actions.setSubmitting)
          }}
        >
          {({ values, submitForm, isSubmitting, handleChange }) => (
            <div className={classes.formDiv}>
              <TextField
                className={classes.field}
                name="name"
                type="text"
                label="Level name"
                placeholder="e.g Silver, Gold, Platinum"
              />
              <TextField
                className={classes.field}
                name="requiredPoints"
                type="number"
                label="Required customer points"
                placeholder="Points needed for this level"
              />
              <div>
                {values.requiredPoints === 0 &&
                <span>This will be the initial level. Customers will get the (end) rewards immediately.</span>}
              </div>

              <Button
                className={classes.colorPickerBtn}
                style={{ backgroundColor: levelColor }}
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
              >Pick a Color</Button>
              <ColorPicker
                open={colorPickerOpen}
                initialColor={levelColor}
                onChange={(color) => {
                  setColorPickerOpen(false)
                  setLevelColor(color)
                }}
              />

              <Typography variant="h6" className={classes.typography}>Level end rewards</Typography>

              <RewardManager rewards={rewards} setRewards={setRewards}/>

              <div className={classes.saveDiv}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                  disabled={isSubmitting}
                >Save</Button>
              </div>
            </div>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
