import React, { Component } from 'react'
import { Toolbar, AppBar, Typography, IconButton, withWidth, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

interface Props {
    handleDrawerToggle: Function,

}
interface State {

}

class Header extends Component<Props, State> {
    state = {}

    render() {

        const { handleDrawerToggle } = this.props;


        return (
            <div>
                <Hidden smUp implementation="css">
                    <AppBar position="fixed" className="{classes.appBar}">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                edge="start"
                                onClick={(event: React.MouseEvent<HTMLElement>) => {
                                    handleDrawerToggle()
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap>
                                kantis.app
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Hidden>
            </div>
        )
    }
}

export default withWidth()(Header)