import { Badge, Link } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import Hidden from '@mui/material/Hidden'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import AppsIcon from '@mui/icons-material/Apps'
import HomeIcon from '@mui/icons-material/Home'
import PhoneIcon from '@mui/icons-material/MobileFriendly'
import PagesIcon from '@mui/icons-material/Pages'
import PeopleIcon from '@mui/icons-material/People'
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import RedeemIcon from '@mui/icons-material/Redeem'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import SettingsIcon from '@mui/icons-material/Settings'
import FeedbackIcon from '@mui/icons-material/Feedback'
import HelpIcon from '@mui/icons-material/Help'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import clsx from 'clsx'
import React from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { NavLink } from "react-router-dom"
import { AccountNotificationValues } from './account/AccountNotifications'

const drawerWidth = 240
export const DOMAIN_HOME_PAGE = "GetLoyalty.App"
export const privacyLink = `https://${DOMAIN_HOME_PAGE}/privacy`
export const termsLink = `https://${DOMAIN_HOME_PAGE}/terms`
export const sourceLink = `https://github.com/toppev/get-loyalty-app/`


const categories = [
  {
    id: 'Business',
    children: [
      { id: 'Overview', icon: <AppsIcon/>, to: '/' },
      { id: 'Campaigns', icon: <RedeemIcon/>, to: '/campaigns' },
      { id: 'Coupons', icon: <LoyaltyIcon/>, to: '/coupons' },
      { id: 'Products', icon: <PermMediaOutlinedIcon/>, to: '/products' },
      { id: 'Customers', icon: <PeopleIcon/>, to: '/customers' },
      { id: 'Notifications', icon: <NotificationsActiveIcon/>, to: '/notifications' },
    ],
  },
  {
    id: 'Site Design',
    children: [
      { id: 'Pages', icon: <PagesIcon/>, to: '/pages' },
      { id: 'Preview', icon: <PhoneIcon/>, to: '/preview' },
      { id: 'Settings', icon: <SettingsIcon/>, to: '/settings' },
    ],
  },
  {
    id: 'Other',
    children: [
      { id: 'QR Scanner', icon: <QrCodeScannerIcon/>, to: `/scanner` },
      { id: 'Data & Charts', icon: <TrendingUpIcon/>, to: '/data-and-charts' },
      { id: 'Feedback', icon: <FeedbackIcon/>, to: '/feedback' },
      { id: 'Help & Support', icon: <HelpIcon/>, to: `https://support.${DOMAIN_HOME_PAGE}` },
    ],
  },
]

const otherLinks = [
  {
    id: 'Privacy',
    to: privacyLink
  },
  {
    id: 'Terms of Service',
    to: termsLink
  },
  {
    id: 'Source Code',
    to: sourceLink
  }
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
      fontSize: '12px',
      color: '#6e7cd0'
    },
    otherLinks: {
      position: 'relative',
    }
  }))

interface NavigatorProps {
  handleDrawerToggle: () => any
  open: boolean,
  notifications: AccountNotificationValues
}

export default function Navigator(props: NavigatorProps) {
  const classes = useStyles()

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

              const external = to.startsWith('http')
              const component = external ? Link : NavLink
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
                  style={{ paddingRight: '6px' }}
                  {...otherProps}
                >
                  <ListItemIcon className={classes.itemIcon}>
                    <Badge badgeContent={props.notifications[childId]} color="secondary">{icon}</Badge>
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.itemPrimary }}>{childId}</ListItemText>
                  {external &&
                    <OpenInNewIcon fontSize="small" style={{ fontSize: '14px', marginLeft: '8px' }}/>}
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
  )

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
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="permanent"
            open={props.open}
          >{drawer}</Drawer>
        </Hidden>
      </nav>
    </div>
  )
}
