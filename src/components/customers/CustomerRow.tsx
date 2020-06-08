import { Box, Button, createStyles, Divider, makeStyles, Theme } from "@material-ui/core";
import React, { useState } from "react";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Customer from "./Customer";
import CustomerDetails from "./CustomerDetails";
import IdText from "../common/IdText";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        boxDesktop: {
            textAlign: 'center',
            margin: '5px 15px',
            padding: '5px 15px'
        },
        div: {
            backgroundColor: 'ghostwhite',
        },
    }));

interface CustomerRowProps extends React.HTMLAttributes<HTMLDivElement> {
    customer: Customer
}

export default function (props: CustomerRowProps) {

    const { customer } = props;
    const { rewards, role, properties } = customer.customerData;

    const classes = useStyles();

    const [viewing, setViewing] = useState(false);

    return (
        <div className={`${classes.div} ${props.className}`}>
            <Box display="flex" flexWrap="wrap" flexDirection="row" p={1} m={1} className={classes.boxDesktop}>
                <Box className={classes.boxDesktop}>
                    {customer.email}
                </Box>
                <Box className={classes.boxDesktop}>
                    Rewards: {rewards.length}
                </Box>
                <Box className={classes.boxDesktop}>
                    Customer Points: {properties.points}
                </Box>
                <Box className={classes.boxDesktop}>
                    Last website visit: {customer.lastVisit?.toLocaleString()}
                </Box>
                { /* Might change the default role from user to customer later */}
                <Box className={classes.boxDesktop}>
                    {role !== 'user' && role !== 'customer' ? `Business Role: ${role}` : ""}
                </Box>
                <Box>
                    <IdText id={customer.id}/>
                </Box>
                <Box className={classes.boxDesktop}>
                    <Button
                        onClick={() => {
                            setViewing(!viewing)
                        }}
                        variant="contained"
                        endIcon={viewing ? (<VisibilityOffIcon/>) : (<VisibilityIcon/>)}
                    >View</Button>
                </Box>
            </Box>
            <Divider/>
            {viewing && <CustomerDetails initialCustomer={customer}/>}
        </div>
    )
}