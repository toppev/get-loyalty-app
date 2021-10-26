import { Button, createStyles, makeStyles, Theme } from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit'
import React from "react"
import Reward from "./Reward"

interface SelectActionProps {
  reward: Reward
  startEditing?: (reward: Reward) => any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: '10px 5px 5px 0px',
    },
  }))

export default function ({ startEditing, reward }: SelectActionProps) {

  const classes = useStyles()

  return (
    <>
      <Button
        className={classes.button}
        startIcon={(<EditIcon/>)}
        onClick={() => {
          // Don't want to copy recognition
          // It's used to identify this reward even if the _id/id changes
          const { recognition, ...clonedReward } = reward
          if (startEditing) {
            startEditing(new Reward(clonedReward))
          }
        }}
        variant="contained"
        color="primary"
      >Select (clone)</Button>
    </>
  )

}
