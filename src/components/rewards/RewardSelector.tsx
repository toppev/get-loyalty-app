import { Button, createStyles, InputAdornment, LinearProgress, ListItem, makeStyles, TextField, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import React, { useContext, useEffect, useState } from "react";
import { get } from "../../config/axios";
import AppContext from "../../context/AppContext";
import RetryButton from "../common/RetryButton";
import Reward from "./Reward";
import RewardContext from "./RewardContext";
import RewardFormDialog from "./RewardFormDialog";
import RewardRow from "./RewardRow";
import _ from "lodash";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // TODO
        paper: {

        },
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
            marginBottom: '10px',
        },
        newBtn: {
            backgroundColor: 'limegreen',
            marginRight: '15px'
        },
        importBtn: {

        }
    }));

interface RewardSelectorProps {

    onSelect: (reward: Reward) => any

}

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
            setError(error);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {shouldLoad ? (
                <LinearProgress />
            ) : error && false && "TODO REMOVE THE FALSE" ? (
                <RetryButton error={error.toString()} callback={async () => await fetchData()} />
            ) : (<div className={classes.paper}>


                <ListItem className={classes.tools}>
                    <Button className={classes.newBtn} variant="contained"
                        startIcon={(<AddIcon />)}
                        onClick={() => setFormOpen(true)}>New Reward</Button>
                </ListItem>

                <TextField
                    className={classes.search}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        className: classes.input
                    }}
                    InputLabelProps={{ className: classes.inputLabel }}
                    name="reward_search"
                    type="search"
                    placeholder="Search rewards..."
                    onChange={(e) => setSearch(e.target.value)
                    }
                />
                <RewardContext.Consumer>
                    {({ rewards }) => (
                        <ul className={classes.rewardList}>
                            {rewards
                                .filter(searchFilter)
                                .map((item, index) =>
                                    <RewardRow
                                        startEditing={reward => setEditingReward(reward)}
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
                        props.onSelect(reward)
                    }} />

            </div>)}
        </div>
    )
}