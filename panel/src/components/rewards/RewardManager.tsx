import RewardItem, { RemoveEditRewardActions } from "./RewardItem"
import RewardFormDialog from "./RewardFormDialog"
import { Button, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import AddIcon from "@mui/icons-material/Add"
import RewardSelector from "./RewardSelector"
import React, { useState } from "react"
import Reward from "./Reward"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    newRewardBtn: {},
  }))

interface RewardManagerProps {
  rewards: Reward[]
  setRewards: (reward: Reward[]) => any
  maxRewards?: number
}

export default function RewardManager({ rewards, setRewards, maxRewards }: RewardManagerProps) {

  const [editReward, setEditReward] = useState<Reward | undefined>()
  const [rewardSelectorOpen, setRewardSelectorOpen] = useState(false)

  const classes = useStyles()

  return (
    <div>
      {rewards.map(reward => (
        <RewardItem
          key={reward.id}
          reward={reward}
          actions={(
            <RemoveEditRewardActions
              onEdit={() => setEditReward(reward)}
              onRemove={() => {
                if (window.confirm('Confirm removing a reward from this campaign. ' +
                  'This does not affect customers who were previously rewarded.')) {
                  setRewards(rewards.filter(r => r.id !== reward.id))
                }
              }}
            />
          )}
        />
      ))}
      <RewardFormDialog
        open={!!editReward}
        initialReward={editReward}
        onClose={() => setEditReward(undefined)}
        onSubmitted={reward => {
          setEditReward(undefined)
          setRewards(rewards.map(r => r.id === reward.id ? reward : r))
        }}
      />
      {(maxRewards === undefined || rewards.length < maxRewards) &&
        <Button
          className={classes.newRewardBtn}
          variant="contained"
          startIcon={(<AddIcon/>)}
          onClick={() => setRewardSelectorOpen(true)}
        >Add Reward</Button>
      }

      {rewardSelectorOpen && <RewardSelector
        open={rewardSelectorOpen}
        onClose={() => setRewardSelectorOpen(false)}
        onSelect={reward => setRewards([...rewards, reward])}
      />}
    </div>
  )
}
