import React, { useEffect, useState } from "react";
import { createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core";
import Customer from "./Customer";
import RetryButton from "../common/button/RetryButton";
import CustomerRow from "./CustomerRow";
import SearchField from "../common/SearchField";
import Reward from "../rewards/Reward";
import { listCustomers } from "../../services/customerService";
import useRequest from "../../hooks/useRequest";
import useSearch from "../../hooks/useSearch";
import useResponseState from "../../hooks/useResponseState";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        row: {
            margin: '5px 0px'
        },
        p: {
            color: theme.palette.grey[600]
        }
    }));


export const testReward = new Reward(
    "12312",
    'Birthday gift',
    "Free",
    'Free items',
    100,
    'If birthday',
    new Date(),
)

const testCustomers: Customer[] = [{
    _id: '21315',
    birthday: new Date(),
    email: "awda@adw.cadw",
    customerData: {
        role: "admin",
        rewards: [testReward],
        properties: {
            points: 100
        }
    }
}];


export default function () {

    const classes = useStyles();
    // How many customers to render
    const renderLimit = 50;
    // How long to wait before searching (resets every keypress) in milliseconds
    const searchTimeout = 1200;

    const { search, setSearch, searchFilter } = useSearch();
    const { error, loading, response, performRequest } = useRequest();
    // Timeout so we won't spam the API
    const [typingTimeout, setTypingTimeout] = useState<any>();
    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(function () {
            performRequest(() => listCustomers(search))
        }, searchTimeout));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [performRequest, search]);

    const [customers, setCustomers] = useResponseState<Customer[]>(response, []);

    return error ? (
        <RetryButton error={error}/>
    ) : (
        <div>
            <SearchField
                setSearch={setSearch}
                name={"customer_search"}
            />
            <p className={classes.p}>Showing up to {renderLimit} customers at once.</p>
            {loading && <LinearProgress/>}
            {customers.filter(searchFilter).slice(0, renderLimit).map(customer => (
                <CustomerRow
                    className={classes.row}
                    key={customer._id}
                    customer={customer}
                />
            ))}
        </div>
    )
}
