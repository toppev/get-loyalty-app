import { CssBaseline, isWidthUp, withWidth } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Navigator from './components/Navigator';
import PageEditor from './components/pages/PageEditor';
import ProductContext from './components/products/ProductContext';
import { useProductOperations } from './components/products/ProductHook';
import AppContext, { defaultAppContext } from './context/AppContext';
import Header from './Header';
import AccountPage from './components/products/AccountPage';
// Lazy Pages
const OverviewPage = lazy(() => import('./components/overview/OverviewPage'));
const ProductPage = lazy(() => import('./components/products/ProductPage'));
const PagesPage = lazy(() => import('./components/pages/PagesPage'));

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
      bodyDiv: {
        margin: '80px 20px 20px 15px',
        paddingLeft: notMobile ? paddingLeftDrawerOpen + 15 : 0
      },
      loadingDiv: {
        color: 'gray',
      },
    };

    return (
      <div style={styles.bodyDiv}>

        <CssBaseline />

        <Router>
          {
            // TODO: Remove the testing
          }
          <AppContext.Provider value={defaultAppContext}>

            <Header handleDrawerToggle={this.handleDrawerToggle.bind(this)} />
            <div onClick={() => !notMobile && this.handleDrawerToggle.bind(this)()}>
              <Navigator handleDrawerToggle={this.handleDrawerToggle.bind(this)} open={navDrawerOpen} />
            </div>
            {
              //  <LoginDialog/>
            }
            <Suspense
              fallback={(
                <div style={styles.loadingDiv}>
                  <h2>Loading...</h2>
                </div>
              )}>
              <Switch>
                <Route exact path="/">
                  <OverviewPage />
                </Route>
                <Route path="/products">
                  <DefaultProductsPage />
                </Route>
                <Route path="/campaigns">

                </Route>
                <Route path="/customers">

                </Route>
                <Route path="/pages">
                  <PageEditor />
                </Route>
                <Route path="/demo">

                </Route>
                <Route path="/account">
                  <AccountPage/>
                </Route>
                <Route path="/settings">

                </Route>
              </Switch>
            </Suspense>
          </AppContext.Provider>
        </Router >
      </div>
    );
  }
}

function DefaultProductsPage() {

  const state = useProductOperations();

  return (
    <ProductContext.Provider value={state}>
      <ProductPage />
    </ProductContext.Provider>
  )
}


export default withWidth()(App);