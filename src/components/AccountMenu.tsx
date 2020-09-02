import { Badge, createStyles, IconButton, Link, makeStyles, Menu, MenuItem, Theme } from "@material-ui/core";
import React, { useState } from "react";
import { AccountNotificationValues } from "./account/AccountNotifications";
import AccountBox from '@material-ui/icons/AccountBox';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logout } from "../services/authenticationService";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapperDiv: {
            textAlign: 'end',
        },
        menuIcon: {
            marginRight: "2%",
            marginTop: "-15px",
        },
        badge: {
            right: '5px',
            top: '5px'
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
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge classes={{ root: classes.menuIcon, badge: classes.badge }} color="secondary" badgeContent={2}>
                    <AccountCircleIcon className={classes.icon} fontSize="large"/>
                </Badge>
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
                <MenuItem>
                    <Link
                        onClick={() => {
                            logout().then(() => window.location.reload())
                        }}
                    >
                        <ExitToAppIcon/> Logout
                    </Link>
                </MenuItem>
            </Menu>

        </div>
    )
}