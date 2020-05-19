import React from 'react'
import { AppBar, Hidden, IconButton, Toolbar, Typography, withWidth } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { APP_URL } from "./Navigator";

interface HeaderProps {
    handleDrawerToggle: () => any,
}

function Header(props: HeaderProps) {

    const { handleDrawerToggle } = props;


    return (
        <div>
            <Hidden smUp implementation="css">
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            edge="start"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                handleDrawerToggle()
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {APP_URL}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Hidden>
        </div>
    )
}

export default withWidth()(Header)