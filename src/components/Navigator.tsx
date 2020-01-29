import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import AppsIcon from '@material-ui/icons/Apps';
import PagesIcon from '@material-ui/icons/Pages';
import RedeemIcon from '@material-ui/icons/Redeem';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsIcon from '@material-ui/icons/Settings';
import PhoneIcon from '@material-ui/icons/MobileFriendly';
import { Omit } from '@material-ui/types';
import { NavLink } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const drawerWidth = 240;

const categories = [
    {
        id: 'Business',
        children: [
            { id: 'Overview', icon: <AppsIcon />, to: '/' },
            { id: 'Campaigns', icon: <RedeemIcon />, to: '/campaigns' },
            { id: 'Products', icon: <PermMediaOutlinedIcon />, to: '/products' },
            { id: 'Customers', icon: <PeopleIcon />, to: '/customers' },
        ],
    },
    {
        id: 'Site Design',
        children: [
            { id: 'Theme', icon: <PublicIcon />, to: '/theme' },
            { id: 'Pages', icon: <PagesIcon />, to: '/pages' },
            { id: 'Demo', icon: <PhoneIcon />, to: '/demo' },
        ],
    },
    {
        id: 'Other',
        children: [
            { id: 'Other Settings', icon: <SettingsIcon />, to: '/settings' },
        ],
    },
];

const styles = (theme: Theme) =>
    createStyles({
        categoryHeader: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        categoryHeaderPrimary: {
            color: 'darkslategray',
            fontSize: 16
        },
        item: {
            paddingTop: 1,
            paddingBottom: 1,
            fontSize: 20,
            color: '#3495eb',
        },
        itemCategory: {
            backgroundColor: '#232f3e',
            boxShadow: '0 -1px 0 #404854 inset',
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        kantisApp: {
            fontSize: 24,
            color: theme.palette.common.white,
            textAlign: 'center'
        },
        active: {
            color: '#34ebb7',
        },
        itemPrimary: {
            fontSize: 'inherit',
        },
        itemIcon: {
            minWidth: 'auto',
            marginRight: theme.spacing(2),
        },
        divider: {
            marginTop: theme.spacing(2),
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

        }
    });

export interface NavigatorProps extends Omit<DrawerProps, 'classes'>, WithStyles<typeof styles> {

    handleDrawerToggle: Function
}

function Navigator(props: NavigatorProps) {
    const { classes } = props;

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
                        <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                        <ListItemText
                            classes={{
                                primary: classes.itemPrimary,
                            }}
                        >
                            {childId}
                        </ListItemText>
                    </ListItem>
                ))}
                <Divider className={classes.divider} />
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
                        <IconButton onClick={(event: React.MouseEvent<HTMLElement>) => { props.handleDrawerToggle() }} className={classes.closeMenuButton}>
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

export default withStyles(styles)(Navigator);