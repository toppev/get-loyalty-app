import { Coupon } from "./Coupon"
import { Button, Paper, Theme } from "@mui/material"
import RewardItem from "../rewards/RewardItem"
import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import { PaperProps } from "@mui/material/Paper/Paper"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsDiv: {
      textAlign: 'center'
    },
    button: {
      margin: '15px 12px 0px 12px'
    },
    inner: {
      padding: '20px'
    }
  }))

interface CouponProps extends PaperProps {
  coupon: Coupon
  onEdit: () => any
  onDelete: () => any
}

export default function CouponCard({ coupon, onEdit, onDelete, ...props }: CouponProps) {

  const classes = useStyles()

  return (
    <Paper key={coupon.id} {...props}>
      <div className={classes.inner}>
        <RewardItem reward={coupon.reward!!}/>

        <div className={classes.buttonsDiv}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={onEdit}
          >Edit</Button>

          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            onClick={() => {
              if (window.confirm('Do you want to delete this coupon? This action is irreversible.')) {
                onDelete()
              }
            }}
          >Delete</Button>
        </div>
      </div>

    </Paper>
  )
}
