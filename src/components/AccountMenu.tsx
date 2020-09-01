import { Badge, createStyles, IconButton, Link, makeStyles, Menu, MenuItem, Theme } from "@material-ui/core";
import React, { useState } from "react";
import { AccountNotificationValues } from "./account/AccountNotifications";
import AccountBox from '@material-ui/icons/AccountBox';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapperDiv: {
            textAlign: 'end',
        },
        badge: {
            marginRight: "2%",
            marginTop: "-15px",
        },
        icon: {
            color: theme.palette.grey[200]
        },
        menu: {
            marginTop: '40px',
            minWidth: '100px'
        }
    }));

interface AccountButtonProps {
    notifications: AccountNotificationValues
}

export default function (props: AccountButtonProps) {

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState<any | undefined>(undefined);

    return (
        <div className={classes.wrapperDiv}>
            <Badge className={classes.badge} badgeContent={props.notifications['My Account']}>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <AccountCircleIcon className={classes.icon} fontSize="large"/>
                </IconButton>

                <Menu
                    className={classes.menu}
                    anchorEl={anchorEl}
                    keepMounted
                    open={!!anchorEl}
                    onClose={() => setAnchorEl(undefined)}
                >
                    <MenuItem>
                        <Link href="/account">
                            <AccountBox fontSize="small"/> My Account
                        </Link>
                    </MenuItem>
                </Menu>
            </Badge>

        </div>
    )
}