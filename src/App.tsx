import React from 'react';
import './App.css';
import Navigator from './components/Navigator'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Product from './components/products/Product';
import Header from './Header';
import { withWidth, isWidthUp } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

interface Props {
  width: Breakpoint
}

interface State {
  navDrawerOpen: boolean
}

class App extends React.Component<Props, State> {

  state = {
    navDrawerOpen: false
  };

  handleDrawerToggle() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  }

  render() {

    let { navDrawerOpen } = this.state;
    const paddingLeftDrawerOpen = 236;
    const notMobile = isWidthUp('sm', this.props.width);

    const styles = {
      header: {
        paddingRight: notMobile && navDrawerOpen ? paddingLeftDrawerOpen : 0
      },
      body: {
        margin: '80px 20px 20px 15px',
        paddingLeft: notMobile ? paddingLeftDrawerOpen + 15 : 0
      }
    };

    return (
      <Router>
        <div className="App">
          <Header handleDrawerToggle={this.handleDrawerToggle.bind(this)} />
          <Navigator handleDrawerToggle={this.handleDrawerToggle.bind(this)} open={navDrawerOpen} />
          <body style={styles.body}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/products">
                <Product product={{ name: "Product1", description: "Desc" }} />
                <Product product={{ name: "Product1", description: "Desc" }} />
                <Product product={{ name: "Product1", description: "Desc" }} />

                <Product product={{ name: "Product1", description: "Desc" }} />
              </Route>
              <Route path="/campaigns">

              </Route>
              <Route path="/customers">

              </Route>
              <Route path="/theme">

              </Route>
              <Route path="/pages">

              </Route>
              <Route path="/demo">

              </Route>
              <Route path="/settings">

              </Route>
            </Switch>
          </body>
        </div>
      </Router>
    );
  }
}


function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}


export default withWidth()(App);
