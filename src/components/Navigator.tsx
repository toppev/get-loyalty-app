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
import FeedbackIcon from '@material-ui/icons/Feedback';
import HelpIcon from '@material-ui/icons/Help';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
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
            { id: 'Feedback', icon: <FeedbackIcon/>, to: '/feedback' },
            { id: 'Help & Support', icon: <HelpIcon/>, to: `https://support.${DOMAIN_HOME_PAGE}` },
        ],
    },
];

const otherLinks = [
    {
        id: 'Privacy',
        to: `https://${DOMAIN_HOME_PAGE}/privacy`
    },
    {
        id: 'Terms of Service',
        to: `https://${DOMAIN_HOME_PAGE}/terms`
    },
]

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
        footerItem: {
            fontSize: '12px'
        },
        otherLinks: {
            position: 'relative',
        }
    }));

interface NavigatorProps {
    handleDrawerToggle: () => any
    open: boolean,
    notifications: AccountNotificationValues
}

export default function Navigator(props: NavigatorProps) {
    const classes = useStyles();

    const drawer = (
        <>
            <List disablePadding>
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
                        <Link color="inherit" style={{ color: '#8fc4da' }} href={`https://panel.${DOMAIN_HOME_PAGE}`}
                        >Control Panel</Link>
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
                        {children.map(({ id: childId, icon, to }) => {

                            const external = to.startsWith('http');
                            const component = external ? Link : NavLink;
                            const otherProps = external ? {
                                href: to,
                                target: "_blank",
                                rel: "noopener noreferrer"
                            } : {
                                activeClassName: classes.active,
                                exact: true,
                                to: to
                            }

                            return (
                                <ListItem
                                    key={childId}
                                    button
                                    component={component}
                                    className={classes.item}
                                    style={{paddingRight: '6px'}}
                                    {...otherProps}
                                >
                                    <ListItemIcon className={classes.itemIcon}>
                                        <Badge badgeContent={props.notifications[childId]}
                                               color="secondary">{icon}</Badge>
                                    </ListItemIcon>
                                    <ListItemText classes={{ primary: classes.itemPrimary }}>{childId}</ListItemText>
                                    {external && <OpenInNewIcon fontSize="small" style={{ fontSize: '14px', marginLeft: '8px' }}/>}
                                </ListItem>
                            )
                        })}
                        <div className={classes.divider}/>
                    </React.Fragment>
                ))}
            </List>
            <List className={classes.otherLinks}>
                {otherLinks.map(link => (
                    <ListItem
                        className={classes.footerItem}
                        key={link.id}
                        button
                        component={Link}
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                    >{link.id}</ListItem>
                ))}
            </List>
        </>
    );

    return (
        <div className={classes.root}>
            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        className={classes.drawerPaper}
                        onClose={props.handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better performance on mobile
                        }}
                        open={props.open}
                    >
                        <IconButton
                            onClick={props.handleDrawerToggle}
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
                    >{drawer}</Drawer>
                </Hidden>
            </nav>
        </div>
    );
}