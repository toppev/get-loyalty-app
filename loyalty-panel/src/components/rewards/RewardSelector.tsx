import { Button, createStyles, Dialog, DialogContent, LinearProgress, ListItem, makeStyles, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import _ from "lodash";
import React, { useState } from "react";
import RetryButton from "../common/button/RetryButton";
import Reward from "./Reward";
import RewardFormDialog from "./RewardFormDialog";
import RewardItem from "./RewardItem";
import SelectRewardButton from "./SelectRewardButton";
import SearchField from "../common/SearchField";
import useRequest from "../../hooks/useRequest";
import useResponseState from "../../hooks/useResponseState";
import { listRewards } from "../../services/rewardService";
import CloseButton from "../common/button/CloseButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      height: '480px',
    },
    paper: {},
    rewardList: {
      paddingLeft: 0,
    },
    search: {
      marginBottom: '25px',
    },
    input: {
      color: 'white',
    },
    inputLabel: {
      color: 'white'
    },
    tools: {
      marginBottom: '25px',
    },
    newBtn: {
      backgroundColor: 'limegreen',
      marginRight: '15px'
    },
    importBtn: {},
    noRewards: {
      color: theme.palette.grey[600]
    }
  }));

interface RewardSelectorProps {
  onClose: () => any
  onSelect: (reward: Reward) => any
  open: boolean
}

/**
 * Dialog to select a reward
 */
export default function (props: RewardSelectorProps) {

  const classes = useStyles();

  const [formOpen, setFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | undefined>();
  const [search, setSearch] = useState("");

  const { loading, error, response } = useRequest(listRewards);

  const [rewards] = useResponseState<Reward[]>(response, []);

  const searchFilter = (reward: Reward) => search.length ? JSON.stringify(reward).toLowerCase().includes(search) : true;

  const filteredRewards = rewards.filter(searchFilter)

  return (
    <Dialog open={props.open} fullWidth onClose={props.onClose}>
      <CloseButton onClick={props.onClose}/>
      <DialogContent className={classes.dialogContent}>
        {loading && <LinearProgress/>}
        <RetryButton error={error}/>
        <div className={classes.paper}>
          <SearchField
            textColor="black"
            setSearch={setSearch}
            name={"reward_search"}
            placeholder={"Search rewards..."}
          />
          <ListItem className={classes.tools}>
            <Button
              className={classes.newBtn}
              variant="contained"
              startIcon={(<AddIcon/>)}
              onClick={() => setFormOpen(true)}
            >New Reward</Button>
          </ListItem>
          {filteredRewards.map((item, index) =>
            <RewardItem
              actions={(
                <SelectRewardButton
                  reward={item}
                  startEditing={reward => setEditingReward(reward)}
                />
              )}
              key={index}
              reward={item}
            />
          )}

          {filteredRewards.length === 0 && <p className={classes.noRewards}>No rewards found</p>}

          <RewardFormDialog
            open={formOpen || !!editingReward}
            initialReward={editingReward}
            onClose={() => {
              setFormOpen(false);
              setEditingReward(undefined);
            }}
            onSubmitted={(reward: Reward) => {
              // If it was edited we will clone it, otherwise just use it (as it was not updated)
              if (!_.isEqual(reward, editingReward)) {
                // FIXME
                // A workaround to make sure nothing breaks
                reward.id = `new_reward_${Math.random() * 1000 | 0}`;
              }
              setFormOpen(false);
              setEditingReward(undefined);
              props.onSelect(reward);
              props.onClose();
            }}/>
        </div>
      </DialogContent>
    </Dialog>
  )
}
