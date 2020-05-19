import React, { useState } from "react";
import RewardItem, { RemoveEditRewardActions } from "../rewards/RewardItem";
import Customer from "./Customer";
import Reward from "../rewards/Reward";
import { Button, createStyles, Divider, Grid, LinearProgress, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { YesNo } from "../common/StringUtils";
import RewardFormDialog from "../rewards/RewardFormDialog";
import RetryButton from "../common/button/RetryButton";
import { addCustomerReward, revokeCustomerReward, updateCustomerReward } from "../../services/customerService";
import RewardSelector from "../rewards/RewardSelector";
import useRequest from "../../hooks/useRequest";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {},
        item: {
            margin: '5px',
            padding: '5px'
        },
        rewards: {
            fontSize: '12',
            width: '100%'
        },
        rewardItem: {
            margin: '10px',
            padding: '10px'
        },
        actionBtn: {
            margin: '7px',
        }
    }));


interface CustomerDetailsProps {
    initialCustomer: Customer
}

export default function ({ initialCustomer }: CustomerDetailsProps) {

    const classes = useStyles();
    const [customer, setCustomer] = useState(initialCustomer);
    const { rewards } = customer.customerData;
    const [newRewardOpen, setNewRewardOpen] = useState(false);

    const { error, loading, response, performRequest } = useRequest();

    return error ? (
        <RetryButton error={error}/>
    ) : (
        <>
            {loading && <LinearProgress/>}
            <Grid className={classes.container} container direction="column" alignItems="flex-start">
                <Grid className={classes.item}><b>Birthday: </b>{customer.birthday?.toLocaleDateString() || "Not set"}
                </Grid>
                <Grid className={classes.item}><b>Authentication
                    service: </b>{customer.authentication?.service || 'Local'}</Grid>
                <Grid className={classes.item}><b>Has password: </b><YesNo state={customer.hasPassword}/></Grid>
                <Grid className={`${classes.item} ${classes.rewards}`}>

                    <Typography variant="h6">Rewards ({rewards.length}):</Typography>

                    <Button
                        className={classes.actionBtn}
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => setNewRewardOpen(true)}
                    >Give a new Reward</Button>

                    <Divider/>

                    <Grid container direction="row" alignItems="flex-start">

                        {rewards.map(reward =>
                            <Grid item key={reward._id} className={classes.rewardItem}>
                                <CustomerReward
                                    reward={reward}
                                    customer={customer}
                                    onUpdate={setCustomer}
                                />
                            </Grid>
                        )}
                    </Grid>

                </Grid>
            </Grid>

            <RewardSelector
                open={newRewardOpen}
                onClose={() => setNewRewardOpen(false)}
                onSelect={newReward => {
                    performRequest(
                        () => addCustomerReward(customer, newReward),
                        () => {
                            const clone = Object.assign({}, customer);
                            clone.customerData.rewards.push(newReward);
                            setCustomer(clone);
                        }
                    )
                }}
            />
        </>
    )
}

interface CustomerRewardProps {
    reward: Reward
    customer: Customer
    onUpdate: (customer: Customer) => any
}

function CustomerReward({ reward, customer, onUpdate }: CustomerRewardProps) {

    const classes = useStyles();

    const [editing, setEditing] = useState(false);

    const { error, loading, response, performRequest } = useRequest();

    return error ? (
        <RetryButton error={error}/>
    ) : (
        <div>
            {loading && <LinearProgress/>}
            <RewardItem
                reward={reward}
                actions={(
                    <RemoveEditRewardActions
                        onEdit={() => setEditing(true)}
                        onRemove={() => {
                            if (window.confirm('Do you want to revoke the reward from this customer? This action is irreversible.')) {
                                performRequest(() => revokeCustomerReward(customer, reward));
                            }
                        }}
                        removeText="Revoke"
                    />
                )}
            />

            {editing && <RewardFormDialog
                open={editing}
                initialReward={reward}
                onClose={() => setEditing(false)}
                onSubmitted={updatedReward => {
                    setEditing(false);
                    performRequest(
                        // Always update only, never adds new rewards
                        () => updateCustomerReward(customer, reward),
                        () => {
                            const clone: Customer = Object.assign({}, customer);
                            clone.customerData.rewards = [...clone.customerData.rewards.filter(r => r._id !== updatedReward._id), updatedReward]
                            onUpdate(clone);
                        }
                    );
                }}
            />}

        </div>
    )
}