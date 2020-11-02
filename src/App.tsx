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
import { backendURL } from "./config/axios";
import { ErrorBoundary } from "./components/ErrorBoundary";
import AccountButton from "./components/account/AccountMenu";
import { getOrCreateServer } from "./services/serverService";

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
const FeedbackPage = lazy(() => import('./components/feedback/FeedbackPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));


export default function () {

    // Whether we know the API url (e.g from local storage)
    const validAPI = !backendURL.includes('invalid_url')

    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState<AccountNotificationValues>({});
    const [loginDialog, setLoginDialog] = useState(!validAPI);
    // Don't close dialog before everything has loaded so it won't try loading invalid stuff (undefined business id etc)
    const [showContent, setShowContent] = useState(false);

    const context = defaultAppContext;
    context.setUser = user => {
        setAppContext(prev => ({ ...prev, user }));
    }

    context.setBusiness = business => {
        setAppContext(prev => ({ ...prev, business }));
        setShowContent(true);
        setLoginDialog(false);
    }
    const [appContext, setAppContext] = useState<AppContextInterface>(context);

    useEffect(() => {
        const { user, loggedIn } = appContext;
        setNotifications(prev => {
            return {
                ...prev,
                'My Account': loggedIn ? (+!user.email) + (+!user.hasPassword) : 0
            }
        })
    }, [appContext]);

    useEffect(() => {
        // Login -> fetch business or create one
        if (validAPI) {
            profileRequest()
                .then(res => {
                    if (res.data.businessOwner) {
                        onLoginOrAccountCreate(context, res)
                    } else {
                        console.log('Can not login to panel: not a business owner')
                        setLoginDialog(true)
                    }
                })
                .catch(err => {
                    console.log(err.response.data || err);
                    const commonError = 'Something went wrong...\nPerhaps our servers are down :(' +
                        '\nPlease try refreshing the page or clearing cookies and logging in'

                    const alertAndOpenLogin = (data: any) => {
                        window.alert(data?.message || commonError)
                        setLoginDialog(true);
                    }
                    // Check if the plan expired
                    getOrCreateServer({ email: context.user.email }, false)
                        // @ts-ignore
                        .then(({ data }) => alertAndOpenLogin(data))
                        .catch(({ response }) => alertAndOpenLogin(response.data))
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDrawerToggle = () => setNavDrawerOpen(!navDrawerOpen);

    const theme = useTheme();
    const notMobile = useMediaQuery(theme.breakpoints.up('sm'));

    const paddingLeftDrawerOpen = 209;
    const leftRightPadding = notMobile ? 25 : 10

    const styles = {
        header: {
            paddingRight: notMobile && navDrawerOpen ? paddingLeftDrawerOpen : 0
        },
        bodyDiv: {
            margin: `65px ${leftRightPadding}px 20px ${leftRightPadding}px`,
            paddingLeft: notMobile ? paddingLeftDrawerOpen : 0,
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
                <div>
                    <div onClick={() => !notMobile && handleDrawerToggle()}>
                        <Navigator
                            notifications={notifications}
                            handleDrawerToggle={handleDrawerToggle}
                            open={navDrawerOpen}
                        />
                    </div>
                    <AccountButton notifications={notifications}/>
                </div>
                {loginDialog && <LoginDialog open={loginDialog}/>}
                {showContent &&
                <ErrorBoundary>
                    <div style={styles.content}>
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
                                <Route path="/feedback">
                                    <FeedbackPage/>
                                </Route>

                                <Route>
                                    <NotFoundPage/>
                                </Route>
                            </Switch>
                        </Suspense>
                    </div>
                </ErrorBoundary>}
            </AppContext.Provider>
        </Router>
    </div>);
}