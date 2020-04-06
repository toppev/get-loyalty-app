import { CssBaseline, useMediaQuery, useTheme } from '@material-ui/core';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Navigator from './components/Navigator';
import ProductContext from './components/products/ProductContext';
import { useProductOperations } from './components/products/ProductHook';
import AppContext, { AppContextInterface, defaultAppContext } from './context/AppContext';
import Header from './Header';
import { NotificationValues } from './Notifications';
// Lazy Pages
const OverviewPage = lazy(() => import('./components/overview/OverviewPage'));
const ProductPage = lazy(() => import('./components/products/ProductPage'));
const PagesPage = lazy(() => import('./components/pages/PagesPage'));
const AccountPage = lazy(() => import('./components/account/AccountPage'));



export default function () {

  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationValues>({})
  const [appContext, setAppContext] = useState<AppContextInterface>(defaultAppContext);

  useEffect(() => {

    const { user } = appContext;

    setNotifications(notifications => {
      // +1 if email is missing, +1 if password is missing
      notifications['My Account'] = (+!!!user.email) + (+!!!user.hasPassword);
      return notifications;
    });
  }, [appContext]);

  const handleDrawerToggle = () => {
    setNavDrawerOpen(!navDrawerOpen);
  }

  const paddingLeftDrawerOpen = 236;

  const theme = useTheme();
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'));

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
        <AppContext.Provider value={appContext}>
          <Header handleDrawerToggle={handleDrawerToggle} />
          <div onClick={() => !notMobile && handleDrawerToggle()}>
            <Navigator notifications={notifications} handleDrawerToggle={handleDrawerToggle} open={navDrawerOpen} />
          </div>
          {
            // <LoginDialog />
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
                <PagesPage />
              </Route>
              <Route path="/demo">

              </Route>
              <Route path="/account">
                <AccountPage />
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

function DefaultProductsPage() {

  const state = useProductOperations();

  return (
    <ProductContext.Provider value={state}>
      <ProductPage />
    </ProductContext.Provider>
  )
}