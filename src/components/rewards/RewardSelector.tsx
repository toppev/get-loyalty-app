import {
    Button,
    createStyles,
    Dialog,
    DialogContent,
    IconButton,
    LinearProgress,
    ListItem,
    makeStyles,
    Theme
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { get } from "../../config/axios";
import AppContext from "../../context/AppContext";
import RetryButton from "../common/button/RetryButton";
import Reward from "./Reward";
import RewardContext from "./RewardContext";
import RewardFormDialog from "./RewardFormDialog";
import RewardItem from "./RewardItem";
import SelectRewardButton from "./SelectRewardButton";
import SearchField from "../common/SearchField";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialogContent: {
            height: '480px',
            width: '640px'
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
        closeButton: {
            position: 'absolute',
            right: 0,
            color: theme.palette.grey[500],
        },
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

    const appContext = useContext(AppContext);
    // Whether it should load or is loading
    const [shouldLoad, setShouldLoad] = useState(appContext.loggedIn);
    const [error, setError] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | undefined>();
    const [search, setSearch] = useState("");

    const searchFilter = (reward: Reward) => search.length ? JSON.stringify(reward).toLowerCase().includes(search) : true;

    const context = useContext(RewardContext);

    const classes = useStyles();

    const fetchData = async () => {
        get(`/business/${appContext.business._id}/reward/all`).then(response => {
            setShouldLoad(false);
            context.addRewards(response.data);
        }).catch(error => {
            setShouldLoad(false);
            setError(error?.response?.message || error.message || 'Failed to load rewards');
        });
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    return (
        <Dialog open={props.open} maxWidth={false}>
            <IconButton className={classes.closeButton} aria-label="close" onClick={props.onClose}>
                <CloseIcon/>
            </IconButton>
            <DialogContent className={classes.dialogContent}>
                {shouldLoad ? (
                    <LinearProgress/>
                ) : error ? (
                    <RetryButton error={{
                        message: error, retry: async () => {
                            setError('');
                            await fetchData()
                        }
                    }}/>
                ) : (<div className={classes.paper}>

                    <SearchField
                        textColor="black"
                        setSearch={setSearch}
                        name={"reward_search"}
                        placeholder={"Reward products..."}
                    />

                    <ListItem className={classes.tools}>
                        <Button className={classes.newBtn} variant="contained"
                                startIcon={(<AddIcon/>)}
                                onClick={() => setFormOpen(true)}>New Reward</Button>
                    </ListItem>

                    <RewardContext.Consumer>
                        {({ rewards }) => (
                            <ul className={classes.rewardList}>
                                {rewards
                                    .filter(searchFilter)
                                    .map((item, index) =>
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
                            </ul>
                        )}
                    </RewardContext.Consumer>

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
                                reward._id = "new_reward"; // Just make sure possible future changes won't break and update the reward instead of creating a new one
                                context.addRewards([reward]);
                            }
                            setFormOpen(false);
                            setEditingReward(undefined);
                            props.onSelect(reward);
                            props.onClose();
                        }}/>

                </div>)}
            </DialogContent>
        </Dialog>
    )
}