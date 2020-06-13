import React, { useEffect, useState } from "react";
import { Box, Button, createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core";
import Customer from "./Customer";
import RetryButton from "../common/button/RetryButton";
import SearchField from "../common/SearchField";
import { listCustomers, rewardAllCustomers } from "../../services/customerService";
import useRequest from "../../hooks/useRequest";
import useSearch from "../../hooks/useSearch";
import useResponseState from "../../hooks/useResponseState";
import { Link } from "react-router-dom";
import RewardSelector from "../rewards/RewardSelector";
import CustomerRow from "./CustomerRow";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        row: {
            margin: '5px 0px'
        },
        p: {
            color: theme.palette.grey[600]
        },
        tools: {
            marginBottom: '25px',
        },
        actionBtn: {
            backgroundColor: theme.palette.grey[400],
            margin: '0px 12px',
            right: '15px'
        }
    }));


export default function () {

    const classes = useStyles();
    // How many customers to render
    const renderLimit = 50;
    // How long to wait before searching (resets every keypress) in milliseconds
    const searchTimeout = 900;

    const { search, setSearch, searchFilter } = useSearch();
    const { error, loading, response, performRequest } = useRequest();
    // Timeout so we won't spam the API endpoint
    const [typingTimeout, setTypingTimeout] = useState<any>();
    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(function () {
            performRequest(() => listCustomers(search))
            setTypingTimeout(undefined)
        }, searchTimeout));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [performRequest, search]);
    const [customers, setCustomers] = useResponseState<Customer[]>(response, [], (res) => {
        return res.data.customers?.map((it: any) => new Customer(it)) || []
    });
    const [rewardAllSelector, setRewardAllSelector] = useState(false);

    return error ? (
        <RetryButton error={error}/>
    ) : (
        <div>
            <Box display="flex" className={classes.tools}>
                <Button
                    className={classes.actionBtn}
                    component={Link}
                    to="/notifications"
                    variant="contained"
                >Send Notification</Button>
                <Button
                    className={classes.actionBtn}
                    variant="contained"
                    onClick={() => setRewardAllSelector(true)}
                >Reward All</Button>
                <Button
                    disabled
                    className={classes.actionBtn}
                    variant="contained"
                >Export (WIP)</Button>
            </Box>
            <SearchField
                setSearch={setSearch}
                name={"customer_search"}
            />
            <RewardSelector
                onClose={() => setRewardAllSelector(false)}
                open={rewardAllSelector}
                onSelect={(reward) => {
                    if (window.confirm('You are about to reward to EVERYONE.' +
                        '\nThis action is irreversible.' +
                        '\nClick OK to confirm rewarding all customers.')) {
                        setRewardAllSelector(false)
                        performRequest(
                            () => rewardAllCustomers(reward),
                            () => performRequest(() => listCustomers(search))
                        )
                    }
                }}
            />
            <p className={classes.p}>Showing up to {renderLimit} customers at once</p>
            {(loading || typingTimeout !== undefined) && <LinearProgress/>}
            {customers.filter(searchFilter).slice(0, renderLimit).map(customer => (
                <CustomerRow
                    className={classes.row}
                    key={customer.id}
                    customer={customer}
                />
            ))}
        </div>
    )
}
