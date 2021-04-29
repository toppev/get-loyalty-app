import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import React from 'react'
import Reward from './Reward'
import { DateExpired } from "../common/StringUtils"
import EditIcon from "@material-ui/icons/Edit"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowDiv: {
      backgroundColor: 'ghostwhite',
      marginBottom: '5px',
      padding: '15px',
      borderRadius: '3px',
      lineHeight: '1.5'
    },
    icon: {
      marginLeft: '8px'
    },
    itemName: {
      margin: '5px',
    },
    noMobile: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    alignRight: {
      textAlign: 'end'
    },
    actionBtn: {
      margin: '7px',
    }
  }))

interface RewardRowProps {
  reward: Reward,
  actions?: JSX.Element
}

export default function (props: RewardRowProps) {

  const classes = useStyles()

  const { actions, reward } = props

  return (
    <div className={classes.rowDiv}>
      <Grid container direction="column" justify="space-evenly" alignItems="flex-start">
        <Grid item>
          Name: <b>{reward.name}</b>
        </Grid>
        {reward.description && <Grid item>
          Description: <b>{reward.description}</b>
        </Grid>}
        <Grid item>
          Discount: <b>{reward.itemDiscount}</b>
        </Grid>
        <Grid item>
          Customer Points: <b>{reward.customerPoints && (<span>{reward.customerPoints}</span>)}</b>
        </Grid>
        <Grid item>
          Expires: <DateExpired date={reward.expires} alt="never"/>
        </Grid>
        {reward.requirement && <Grid
          item> Note: {reward.requirement}
        </Grid>}
        <Grid item>
          Products: {reward.products.length ? reward.products.map(p => p.name).join(", ") : 'Any product'}
        </Grid>
        <Grid item>
          Categories: {reward.categories.length ? reward.categories.map(c => c.name).join(", ") : 'Any category'}
        </Grid>
        <Grid item className={classes.alignRight}>
          {actions}
        </Grid>
      </Grid>
    </div>
  )
}


interface RemoveEditRewardActionsProps {
  onEdit: () => any
  onRemove: () => any,
  editText?: string,
  removeText?: string,

}

export function RemoveEditRewardActions({ onEdit, onRemove, editText, removeText }: RemoveEditRewardActionsProps) {

  const classes = useStyles()

  return (
    <>
      <Button
        className={classes.actionBtn}
        size="small"
        color="primary"
        startIcon={(<EditIcon/>)}
        onClick={onEdit}
      >{editText || "Edit"}</Button>

      <Button
        className={classes.actionBtn}
        size="small"
        color="secondary"
        onClick={onRemove}
      >{removeText || "Remove"}</Button>
    </>
  )
}
