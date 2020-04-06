import { Badge } from '@material-ui/core';
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
import RedeemIcon from '@material-ui/icons/Redeem';
import SettingsIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';
import React from 'react';
import { NavLink } from "react-router-dom";
import { NotificationValues } from '../Notifications';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const drawerWidth = 240;

const categories = [
    {
        id: 'Business',
        children: [
            { id: 'Overview', icon: <AppsIcon />, to: '/' },
            { id: 'Products', icon: <PermMediaOutlinedIcon />, to: '/products' },
            { id: 'Campaigns', icon: <RedeemIcon />, to: '/campaigns' },
            { id: 'Customers', icon: <PeopleIcon />, to: '/customers' },
        ],
    },
    {
        id: 'Site Design',
        children: [
            { id: 'Pages', icon: <PagesIcon />, to: '/pages' },
            { id: 'Demo', icon: <PhoneIcon />, to: '/demo' },
        ],
    },
    {
        id: 'Other',
        children: [
            { id: 'My Account', icon: <AccountBox />, to: '/account' },
            { id: 'Other Settings', icon: <SettingsIcon />, to: '/settings' },
        ],
    },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        categoryHeader: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        categoryHeaderPrimary: {
            color: theme.palette.grey[500],
            fontSize: 14
        },
        item: {
            paddingTop: 1,
            paddingBottom: 1,
            fontSize: 18,
            color: '#1072c9',
        },
        itemCategory: {
            backgroundColor: '#232f3e',
            boxShadow: '0 -1px 0 #404854 inset',
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        kantisApp: {
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
            marginTop: theme.spacing(3),
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
        drawerPaper: {

        },
    }));

export interface NavigatorProps {

    handleDrawerToggle: () => any
    open: boolean,
    notifications: NotificationValues
}

export default function Navigator(props: NavigatorProps) {
    const classes = useStyles();

    const drawer = (<List disablePadding>
        <ListItem className={clsx(classes.kantisApp, classes.item, classes.itemCategory)}>
            <ListItemText
                classes={{
                    primary: classes.itemPrimary,
                }}
            >
                kantis.app
            </ListItemText>
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
            <ListItemIcon className={classes.itemIcon}>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText
                classes={{
                    primary: classes.itemPrimary,
                }}
            >
                Management Panel
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
                        className={clsx(classes.item)}
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
                <div className={classes.divider} />
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
                        onClose={(event: React.MouseEvent<HTMLElement>) => { props.handleDrawerToggle() }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        {...props}
                    >
                        <IconButton
                            onClick={(event: React.MouseEvent<HTMLElement>) => { props.handleDrawerToggle() }}
                            className={classes.closeMenuButton}>
                            <CloseIcon />
                        </IconButton>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        {...props}
                    >
                        <div />
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}