import React, { useEffect, useState } from 'react';
import './App.css';
import { getPageHtmlSource, getPages } from "./services/pageService";
import Page from "./model/Page";
import PageView from "./components/PageView";
import { profileRequest, registerRequest } from "./services/authenticationService";
import { Redirect, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { businessId, getBusinessUrl, setBusinessId } from "./config/axios";
import { AxiosResponse } from "axios";
import { claimCoupon } from "./services/couponService";
import { Helmet } from "react-helmet";
import { AppContext, defaultAppContext } from './AppContext';
import NotificationHandler from "./components/NotificationHandler";

function App() {

    const [contextState, setContextState] = useState(defaultAppContext)

    const [error, setError] = useState<any>()
    const [pages, setPages] = useState<Page[]>([])
    // Use setPageRefreshKey with a new value to refresh
    const [pageRefreshKey, setPageRefreshKey] = useState(0)

    // Authentication
    useEffect(() => {
        profileRequest()
            .then(onLogin)
            .catch(err => {
                // TODO: Option to login on other responses?
                const status = err?.response?.status;
                if (status === 403 || status === 404) {
                    // TODO: replace with iframe form
                    registerRequest()
                        .then(onLogin)
                        .catch(_err => setError('Could not register a new account. Something went wrong :('))
                } else {
                    setError('Something went wrong :(')
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onLogin = (res: AxiosResponse) => {
        setContextState({ ...contextState, user: res.data })
        const query = new URLSearchParams(window.parent.location.search)
        const id = query.get('business') || query.get('businessID')
        if (!id || id.length !== 24) {
            if (!error && businessId.length !== 24) {
                setError('Invalid business')
            }
        } else {
            setBusinessId(id)
        }
        const couponCode = query.get('coupon') || query.get('code')
        const checkCoupon = async () => couponCode && claimCoupon(couponCode)
        checkCoupon()
            .then(() => loadPages())
            .catch(err => setError(err))
    }

    const loadPages = () => {
        getPages()
            .then(res => {
                const newPages = res.data
                setPages(newPages)
            })
            .catch(err => {
                console.log(err)
                setError('Failed to load pages')
            })
    }

    return (
        <AppContext.Provider value={contextState}>
            <div className="App">

                <Helmet>
                    <link id="favicon" rel="icon" href={`${getBusinessUrl(true)}/icon`} type="image/x-icon"/>
                    {pages.map(page => <link key={page._id} rel="prefetch" href={getPageHtmlSource(page)}/>)}
                </Helmet>

                <NotificationHandler onRefresh={setPageRefreshKey}/>
                {error && <p className="ErrorMessage">Error: {error.response?.message || error.toString()}</p>}
                <Switch>
                    {pages.map(page => (
                        <Route exact path={`/${page.pathname}`} key={page._id}>
                            <PageView refreshKey={pageRefreshKey} page={page}/>
                        </Route>
                    ))}
                    {pages.length > 0 &&
                    <Redirect to={{ pathname: pages[0].pathname, search: window.location.search }}/>}
                </Switch>
                <Navbar pages={pages || []}/>
            </div>
        </AppContext.Provider>
    )
}

export default App
