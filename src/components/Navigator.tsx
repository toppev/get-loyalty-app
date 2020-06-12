import { Badge, Link } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AccountBox from '@material-ui/icons/AccountBox';
import AppsIcon from '@material-ui/icons/Apps';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import PhoneIcon from '@material-ui/icons/MobileFriendly';
import PagesIcon from '@material-ui/icons/Pages';
import PeopleIcon from '@material-ui/icons/People';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import RedeemIcon from '@material-ui/icons/Redeem';
import SettingsIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';
import React from 'react';
import { NavLink } from "react-router-dom";
import { AccountNotificationValues } from './account/AccountNotifications';

const drawerWidth = 240;
export const DOMAIN_HOME_PAGE = "GetLoyalty.App"

const categories = [
    {
        id: 'Business',
        children: [
            { id: 'Overview', icon: <AppsIcon/>, to: '/' },
            { id: 'Products', icon: <PermMediaOutlinedIcon/>, to: '/products' },
            { id: 'Campaigns', icon: <RedeemIcon/>, to: '/campaigns' },
            { id: 'Customers', icon: <PeopleIcon/>, to: '/customers' },
            { id: 'Notifications', icon: <NotificationsActiveIcon/>, to: '/notifications' },
        ],
    },
    {
        id: 'Site Design',
        children: [
            { id: 'Pages', icon: <PagesIcon/>, to: '/pages' },
            { id: 'Demo', icon: <PhoneIcon/>, to: '/demo' },
            { id: 'Settings', icon: <SettingsIcon/>, to: '/settings' },
        ],
    },
    {
        id: 'Other',
        children: [
            { id: 'My Account', icon: <AccountBox/>, to: '/account' },
        ],
    },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        categoryHeader: {
            paddingTop: '12px',
            paddingBottom: '8px',
        },
        categoryHeaderPrimary: {
            color: theme.palette.grey[500],
            fontSize: 14
        },
        item: {
            paddingTop: '3px',
            paddingBottom: '3px',
            fontSize: 18,
            color: '#1072c9',
        },
        itemCategory: {
            backgroundColor: '#232f3e',
            boxShadow: '0 -1px 0 #404854 inset',
            paddingTop: '12px',
            paddingBottom: '12px',
        },
        appName: {
            fontSize: 22,
            color: theme.palette.common.white,
            textAlign: 'center'
        },
        active: {
            color: '#16c795',
            backgroundColor: theme.palette.grey[200]
        },
        itemPrimary: {
            fontSize: 'inherit',
        },
        itemIcon: {
            minWidth: 'auto',
            marginRight: theme.spacing(2),
        },
        divider: {
            marginTop: '16px',
        },
        root: {
            flexGrow: 1,
            right: 50,
            zIndex: 1,
            overflow: 'hidden',
            display: 'flex',
            width: '100%',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: { drawerWidth },
                flexShrink: 0,
            },
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        closeMenuButton: {
            marginRight: 'auto',
            marginLeft: 0,
        },
        drawerPaper: {},
    }));

interface NavigatorProps {
    handleDrawerToggle: () => any
    open: boolean,
    notifications: AccountNotificationValues
}

export default function Navigator(props: NavigatorProps) {
    const classes = useStyles();

    const drawer = (<List disablePadding>
        <ListItem className={clsx(classes.appName, classes.item, classes.itemCategory)}>
            <ListItemText
                classes={{
                    primary: classes.itemPrimary,
                }}
            >
                <Link color="inherit" href={`https://${DOMAIN_HOME_PAGE}`}>{DOMAIN_HOME_PAGE}</Link>
            </ListItemText>
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
            <ListItemIcon className={classes.itemIcon}>
                <Link color="inherit" href={`https://panel.${DOMAIN_HOME_PAGE}`}>
                    <HomeIcon/>
                </Link>
            </ListItemIcon>
            <ListItemText
                classes={{
                    primary: classes.itemPrimary,
                }}
            >
                <Link color="inherit" href={`https://panel.${DOMAIN_HOME_PAGE}`}>Management Panel</Link>
            </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
            <React.Fragment key={id}>
                <ListItem className={classes.categoryHeader}>
                    <ListItemText
                        classes={{
                            primary: classes.categoryHeaderPrimary,
                        }}
                    >
                        {id}
                    </ListItemText>
                </ListItem>
                {children.map(({ id: childId, icon, to }) => (
                    <ListItem
                        key={childId}
                        button
                        component={NavLink} exact to={to}
                        activeClassName={classes.active}
                        className={classes.item}
                    >
                        <ListItemIcon className={classes.itemIcon}>
                            <Badge
                                badgeContent={props.notifications[childId]}
                                color="secondary"
                            >{icon}</Badge>
                        </ListItemIcon>
                        <ListItemText
                            classes={{
                                primary: classes.itemPrimary,
                            }}
                        >
                            {childId}
                        </ListItemText>
                    </ListItem>
                ))}
                <div className={classes.divider}/>
            </React.Fragment>
        ))}
    </List>);

    return (
        <div className={classes.root}>
            <nav className={classes.drawer}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        className={classes.drawerPaper}
                        onClose={(e) => props.handleDrawerToggle()}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        open={props.open}
                    >
                        <IconButton
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                props.handleDrawerToggle()
                            }}
                            className={classes.closeMenuButton}>
                            <CloseIcon/>
                        </IconButton>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        open={props.open}
                    >
                        <div/>
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}