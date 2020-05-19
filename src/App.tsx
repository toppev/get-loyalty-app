import { CssBaseline, useMediaQuery, useTheme } from '@material-ui/core';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Navigator from './components/Navigator';
import AppContext, { AppContextInterface, defaultAppContext } from './context/AppContext';
import Header from './Header';
import { NotificationValues } from './Notifications';
import LoginDialog from "./components/authentication/LoginDialog";
import { loginRequest } from "./services/authenticationService";

// Lazy Pages
const OverviewPage = lazy(() => import('./components/overview/OverviewPage'));
const ProductPage = lazy(() => import('./components/products/ProductPage'));
const PagesPage = lazy(() => import('./components/pages/PagesPage'));
const DemoPage = lazy(() => import('./components/pages/demo/DemoPage'));
const AccountPage = lazy(() => import('./components/account/AccountPage'));
const CustomerPage = lazy(() => import('./components/customers/CustomerPage'));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'));
const CampaignPage = lazy(() => import('./components/campaigns/CampaignPage'));
const NotificationsPage = lazy(() => import('./components/notifications/NotificationsPage'));

export default function () {

    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationValues>({});
    const [loginDialog, setLoginDialog] = useState(false);

    const context = defaultAppContext
    context.setUser = user => setAppContext({ ...appContext, user: user })
    context.setBusiness = business => setAppContext({ ...appContext, business: business })
    const [appContext, setAppContext] = useState<AppContextInterface>(context);

    useEffect(() => {
        const { user } = appContext;
        setNotifications(prev => {
            return {
                ...prev,
                'My Account': (+!user.email) + (+!user.hasPassword)
            }
        })
    }, [appContext]);

    useEffect(() => {
        // Quick check first
        if (!document.cookie.includes('session=')) {
            setLoginDialog(true)
        } else {
            loginRequest()
                .then(res => context.setUser(res.data))
                .catch(_err => setLoginDialog(true))
        }
    }, [])

    const handleDrawerToggle = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    const paddingLeftDrawerOpen = 236;

    const theme = useTheme();
    const notMobile = useMediaQuery(theme.breakpoints.up('sm'));

    const styles = {
        header: {
            paddingRight: notMobile && navDrawerOpen ? paddingLeftDrawerOpen : 0
        },
        bodyDiv: {
            margin: '80px 20px 20px 15px',
            paddingLeft: notMobile ? paddingLeftDrawerOpen + 15 : 0,
        },
        content: {},
        loadingDiv: {
            color: 'grey',
        },
    };

    return (<div style={styles.bodyDiv}>
        <CssBaseline/>
        <Router>
            <AppContext.Provider value={appContext}>
                <Header handleDrawerToggle={handleDrawerToggle}/>
                <div onClick={() => !notMobile && handleDrawerToggle()}>
                    <Navigator
                        notifications={notifications}
                        handleDrawerToggle={handleDrawerToggle}
                        open={navDrawerOpen}
                    />
                </div>
                {loginDialog && <LoginDialog open={loginDialog} setOpen={(open) => setLoginDialog(open)}/>}
                {!loginDialog && <div style={styles.content}>
                    <Suspense
                        fallback={(
                            <div style={styles.loadingDiv}>
                                <h2>Loading...</h2>
                            </div>
                        )}>
                        <Switch>
                            <Route exact path="/">
                                <OverviewPage/>
                            </Route>
                            <Route path="/products">
                                <ProductPage/>
                            </Route>
                            <Route path="/campaigns">
                                <CampaignPage/>
                            </Route>
                            <Route path="/customers">
                                <CustomerPage/>
                            </Route>
                            <Route path="/Notifications">
                                <NotificationsPage/>
                            </Route>
                            <Route path="/pages">
                                <PagesPage/>
                            </Route>
                            <Route path="/demo">
                                <DemoPage/>
                            </Route>
                            <Route path="/settings">
                                <SettingsPage/>
                            </Route>
                            <Route path="/account">
                                <AccountPage/>
                            </Route>
                        </Switch>
                    </Suspense>
                </div>}
            </AppContext.Provider>
        </Router>
    </div>);
}