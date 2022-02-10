import React from 'react'
import { AppBar, Hidden, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { DOMAIN_HOME_PAGE } from "./Navigator"

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth

// @ts-ignore
const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props} width="xs" />

interface HeaderProps {
  handleDrawerToggle: () => any,
}

function Header(props: HeaderProps) {

  const { handleDrawerToggle } = props


  return (
    <div>
      <Hidden smUp implementation="css">
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              edge="start"
              onClick={e => handleDrawerToggle()}
              size="large">
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" noWrap>
              {DOMAIN_HOME_PAGE}
            </Typography>
          </Toolbar>
        </AppBar>
      </Hidden>
    </div>
  )
}

export default withWidth()(Header)
