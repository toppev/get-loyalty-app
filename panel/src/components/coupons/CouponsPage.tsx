import makeStyles from "@mui/styles/makeStyles"
import { Box, LinearProgress, Theme } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import useRequest from "../../hooks/useRequest"
import useResponseState from "../../hooks/useResponseState"
import { deleteCoupon, listCoupons } from "../../services/couponService"
import RetryButton from "../common/button/RetryButton"
import NewButton from "../common/button/NewButton"
import React, { useState } from "react"
import { Coupon } from "./Coupon"
import Tip from "../common/Tip"
import CouponCard from "./CouponCard"
import CouponEditor from "./CouponEditor"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '30px 0px',
      maxWidth: '100%',
    },
    noCoupons: {
      color: theme.palette.grey[400],
      margin: '20px'
    },
    coupon: {
      margin: '40px 20px',
    }
  }))

export default function CouponsPage() {

  const classes = useStyles()

  const [editorOpen, setEditorOpen] = useState(false)
  const [formCoupon, setFormCoupon] = useState<Coupon | undefined>()

  const { error, loading, response, execute: fetchCoupons } = useRequest(listCoupons, {})
  const [coupons] = useResponseState<Coupon[]>(response, [])
  const otherRequests = useRequest()

  return error ? (
    <RetryButton error={error}/>
  ) : (
    <div>

      <div style={{ marginBottom: '25px' }}>
        <Tip insertTip={false}>
          Coupons are selected randomly and have an expiration date (usually about 1-7 days).
          <br/>
          The system will automatically keep a few coupons enabled and select new ones when the enabled coupons expire.
        </Tip>
      </div>

      <NewButton
        name="New Coupon"
        buttonProps={{
          onClick: () => {
            setFormCoupon({})
            setEditorOpen(true)
          }
        }}
      />

      {(loading || otherRequests.loading) && <LinearProgress/>}

      <div>

        {coupons.length === 0 && !loading &&
          <p className={classes.noCoupons}>You don't have any coupons. Create one by clicking the button above.</p>}

        <Box display="flex" flexWrap="wrap">
          {coupons.map(coupon => (
            <CouponCard
              className={classes.coupon}
              coupon={coupon}
              onEdit={() => {
                setFormCoupon(coupon)
                setEditorOpen(true)
              }}
              onDelete={() => {
                otherRequests.performRequest(
                  () => deleteCoupon(coupon),
                  () => fetchCoupons())
              }}
            />
          ))}
        </Box>

        <CouponEditor
          open={editorOpen}
          coupon={formCoupon || {}}
          onClose={() => setEditorOpen(false)}
          onSubmitted={() => {
            setEditorOpen(false)
            fetchCoupons()
          }}
        />
      </div>
    </div>
  )
}
