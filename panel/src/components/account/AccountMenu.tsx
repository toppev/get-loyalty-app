import { Badge, IconButton, Link, Menu, MenuItem, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, { useState } from "react"
import { AccountNotificationValues } from "./AccountNotifications"
import AccountBox from '@mui/icons-material/AccountBox'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { logout } from "../../services/authenticationService"

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
      minWidth: '100px',
    },
    linkBadge: {
      paddingLeft: '6px',
      paddingRight: '6px',
      marginTop: "-12px",
    }
  }))

interface AccountButtonProps {
  notifications: AccountNotificationValues
}

export default function (props: AccountButtonProps) {

  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState<any | undefined>(undefined)

  const myAccountNotifications = props.notifications['My Account']
  const allNotifications = myAccountNotifications // Append other notifications here

  return (
    <div className={classes.wrapperDiv}>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="large">
        <Badge classes={{ root: classes.menuIcon, badge: classes.badge }} color="secondary" badgeContent={allNotifications}>
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
            <AccountBox fontSize="small"/>
            My Account
            <Badge classes={{ root: classes.linkBadge }} color="secondary" badgeContent={myAccountNotifications}/>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            onClick={() => {
              logout().finally(() => window.location.reload())
            }}
          >
            <ExitToAppIcon/> Logout
          </Link>
        </MenuItem>
      </Menu>

    </div>
  )
}
