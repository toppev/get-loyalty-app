import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Collapse,
    createStyles,
    IconButton,
    LinearProgress,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme
} from "@material-ui/core";
import Customer from "./Customer";
import RetryButton from "../common/button/RetryButton";
import SearchField from "../common/SearchField";
import { listCustomers, rewardAllCustomers } from "../../services/customerService";
import useRequest from "../../hooks/useRequest";
import useSearch from "../../hooks/useSearch";
import useResponseState from "../../hooks/useResponseState";
import { Link } from "react-router-dom";
import RewardSelector from "../rewards/RewardSelector";
import IdText from "../common/IdText";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CustomerDetails from "./CustomerDetails";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        },
        boxDesktop: {
            textAlign: 'center',
            margin: '5px 15px',
            padding: '5px 15px'
        },
        head: {
            backgroundColor: '#c9d2d4'
        },
        root: {
            backgroundColor: 'ghostwhite',
            '& > *': {
                borderBottom: 'unset',
            }
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
    const [customers] = useResponseState<Customer[]>(response, [], (res) => {
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
                    if (window.confirm('You are about to reward EVERYONE.' +
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

            <TableContainer>
                <Table>
                    <TableHead className={classes.head}>
                        <TableRow>
                            <TableCell>Show/Hide</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rewards</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Last website visit</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.filter(searchFilter).slice(0, renderLimit).map(customer => (
                            <CustomerRow
                                key={customer.id}
                                customer={customer}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}


interface CustomerRowProps {
    customer: Customer
}

function CustomerRow(props: CustomerRowProps) {

    const { customer } = props;
    const { role } = customer;
    const { rewards, properties } = customer.customerData;

    const classes = useStyles();

    const [viewing, setViewing] = useState(false)

    return (
        <>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton
                        onClick={() => setViewing(!viewing)}
                    >{viewing ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</IconButton>
                </TableCell>
                <TableCell>
                    {customer.email}
                </TableCell>
                <TableCell>
                    {rewards.length} rewards
                </TableCell>
                <TableCell>
                    {properties.points} points
                </TableCell>
                <TableCell>
                    {customer.lastVisit?.toLocaleString()}
                </TableCell>
                <TableCell>
                    { /* Might change the default role from user to customer later */}
                    {role !== 'user' && role !== 'customer' ? role : ""}
                </TableCell>
                <TableCell>
                    <IdText id={customer.id} text={false}/>
                </TableCell>
            </TableRow>
            <TableRow className={classes.root}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={viewing} timeout="auto" unmountOnExit>
                        <div className={classes.root}>
                            <CustomerDetails initialCustomer={customer}/>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}