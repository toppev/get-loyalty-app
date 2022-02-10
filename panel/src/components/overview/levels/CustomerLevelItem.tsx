import { CustomerLevel } from "../../../context/AppContext"
import { Button, Paper, Theme, Typography } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React from "react"
import { RenderList } from "../../common/RenderList"
import RewardItem from "../../rewards/RewardItem"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: '10px 25px',
      margin: '15px 15px 15px 0px',
      minHeight: '168px'
    },
    name: {
      fontSize: '24px'
    },
    button: {
      margin: '2px 8px'
    }
  }))

interface CustomerLevelProps {
  level: CustomerLevel
  startEditing: () => any
  onDelete: () => any
}

export default function ({ level, startEditing, onDelete }: CustomerLevelProps) {

  const classes = useStyles()

  return (
    <Paper className={classes.paper} style={{ backgroundColor: level.color || "" }}>
      <Typography className={classes.name}>
        {level.name}
      </Typography>
      {level.requiredPoints === 0 && <p>(initial level)</p>}
      <b>Required points: {level.requiredPoints} </b>
      <RenderList
        list={level.rewards}
        title="Level Rewards:"
        emptyString="none"
        renderAll={items => items.map(item => <RewardItem key={item.id} reward={item}/>)}
      />
      <Button
        size="small"
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={startEditing}
      >Edit</Button>
      <Button
        size="small"
        color="secondary"
        variant="outlined"
        className={classes.button}
        onClick={onDelete}
      >Delete</Button>
    </Paper>
  )
}
