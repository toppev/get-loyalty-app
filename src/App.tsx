import { CssBaseline, useMediaQuery, useTheme } from '@material-ui/core';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Navigator from './components/Navigator';
import AppContext, { AppContextInterface, defaultAppContext } from './context/AppContext';
import Header from './components/Header';
import { AccountNotificationValues } from './components/account/AccountNotifications';
import LoginDialog from "./components/authentication/LoginDialog";
import { onLoginOrAccountCreate, profileRequest } from "./services/authenticationService";
import { setBusinessId } from "./config/axios";

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
    const [notifications, setNotifications] = useState<AccountNotificationValues>({});
    const [loginDialog, setLoginDialog] = useState(false);
    // Don't close dialog before everything has loaded so it won't try loading invalid stuff (undefined business id etc)
    const [showContent, setShowContent] = useState(false);

    const context = defaultAppContext;
    context.setUser = user => {
        setAppContext({ ...appContext, user });
    }

    context.setBusiness = business => {
        setBusinessId(business._id); // Update the id used in (axios) requests
        setAppContext({ ...appContext, business });
        setShowContent(true);
        setLoginDialog(false);
    }
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
        // Login -> fetch business or create one
        profileRequest()
            .then(res => onLoginOrAccountCreate(context, res))
            .catch(err => {
                if (err.response) {
                    console.log(err);
                    setLoginDialog(true);
                } else {
                    window.confirm('Something went wrong... Perhaps our servers are down :( Please try refreshing the page or logging in')
                }
            });
    }, [])

    const handleDrawerToggle = () => setNavDrawerOpen(!navDrawerOpen);

    const paddingLeftDrawerOpen = 236;

    const theme = useTheme();
    const notMobile = useMediaQuery(theme.breakpoints.up('sm'));

    const styles = {
        header: {
            paddingRight: notMobile && navDrawerOpen ? paddingLeftDrawerOpen : 0
        },
        bodyDiv: {
            margin: '65px 20px 20px 15px',
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
                {loginDialog && <LoginDialog open={loginDialog}/>}
                {showContent && <div style={styles.content}>
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