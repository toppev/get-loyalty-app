import { CssBaseline, useMediaQuery, useTheme } from '@mui/material'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import './App.css'
import Navigator from './components/Navigator'
import AppContext, { AppContextInterface, defaultAppContext } from './context/AppContext'
import Header from './components/Header'
import { AccountNotificationValues } from './components/account/AccountNotifications'
import LoginDialog from "./components/authentication/LoginDialog"
import { onLoginOrAccountCreate, profileRequest } from "./services/authenticationService"
import { validBackendURL } from "./config/axios"
import { ErrorBoundary } from "./components/ErrorBoundary"
import AccountButton from "./components/account/AccountMenu"
import { getOrCreateServer } from "./services/serverService"
import { ThemeProvider, Theme, StyledEngineProvider, createTheme } from '@mui/material/styles'


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


// Lazy Pages
const OverviewPage = lazy(() => import('./components/overview/OverviewPage'))
const ProductPage = lazy(() => import('./components/products/ProductPage'))
const CampaignPage = lazy(() => import('./components/campaigns/CampaignPage'))
const CustomerPage = lazy(() => import('./components/customers/CustomerPage'))
const NotificationsPage = lazy(() => import('./components/notifications/NotificationsPage'))

const PagesPage = lazy(() => import('./components/pages/PagesPage'))
const DemoPage = lazy(() => import('./components/pages/demo/DemoPage'))
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'))

const AccountPage = lazy(() => import('./components/account/AccountPage'))
const LoginPage = lazy(() => import('./components/authentication/LoginPage'))

const FeedbackPage = lazy(() => import('./components/feedback/FeedbackPage'))
const DataAndChartsPage = lazy(() => import('./components/charts/DataAndChartsPage'))
const NotFoundPage = lazy(() => import('./components/NotFoundPage'))


const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
  },
})

export default function App() {

  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const [notifications, setNotifications] = useState<AccountNotificationValues>({})
  const [loginDialog, setLoginDialog] = useState(!validBackendURL())
  // Don't close dialog before everything has loaded so it won't try loading invalid stuff (undefined business id etc)
  const [showContent, setShowContent] = useState(false)

  const context = defaultAppContext
  context.setUser = user => {
    setAppContext(prev => ({ ...prev, user, loggedIn: !!user?._id }))
  }
  context.setBusiness = business => {
    setAppContext(prev => ({ ...prev, business }))
    setShowContent(true)
    setLoginDialog(false)
  }
  const [appContext, setAppContext] = useState<AppContextInterface>(context)

  useEffect(() => {
    const { user, loggedIn } = appContext
    setNotifications(prev => {
      return {
        ...prev,
        'My Account': loggedIn ? (+!user.email) + (+!user.hasPassword) : 0
      }
    })
  }, [appContext])

  useEffect(() => {
    // Login -> fetch business or create one
    if (validBackendURL()) {
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
          console.log(err.response?.data || err)
          if (!context.user.email?.trim()) {
            setLoginDialog(true)
            return
          }

          const alertAndOpenLogin = (data: any) => {
            const commonError = 'Something went wrong...\nPerhaps our servers are down :(' +
              '\nPlease try refreshing the page or clearing cookies and logging in.'
            window.alert(data?.message || commonError)
            setLoginDialog(true)
          }
          // Check if the plan expired
          // FIXME: email is empty, not saved in local storage or anywhere so no personalized messages .-.
          getOrCreateServer({ email: context.user.email }, false)
            // @ts-ignore
            .then(({ data }) => alertAndOpenLogin(data))
            .catch(({ response }) => alertAndOpenLogin(response.data))
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDrawerToggle = () => setNavDrawerOpen(!navDrawerOpen)

  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  const paddingLeftDrawerOpen = 209
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
  }

  const showNavBar = window.location.pathname !== '/login' // hacky but works

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div style={styles.bodyDiv}>
          <CssBaseline/>
          <Router>
            <AppContext.Provider value={appContext}>
              {showNavBar && (
                <>
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
                </>
              )}
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
                        {/* Business */}
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
                        <Route path="/notifications">
                          <NotificationsPage/>
                        </Route>

                        {/* Pages */}
                        <Route path="/pages">
                          <PagesPage/>
                        </Route>
                        <Route path="/demo">
                          <DemoPage/>
                        </Route>
                        <Route path="/settings">
                          <SettingsPage/>
                        </Route>

                        {/* User */}
                        <Route path="/account">
                          <AccountPage/>
                        </Route>
                        <Route path="/login">
                          <LoginPage/>
                        </Route>

                        {/* Other */}
                        <Route path="/data-and-charts">
                          <DataAndChartsPage/>
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
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
