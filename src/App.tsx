import React, { useEffect, useState } from 'react';
import './App.css';
import { getPageHtml, getPages } from "./services/pageService";
import Page, { ERROR_HTML } from "./model/Page";
import PageView from "./components/PageView";
import { profileRequest, registerRequest } from "./services/authenticationService";
import { Redirect, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { businessId, getBusinessUrl, setBusinessId } from "./config/axios";
import { AxiosResponse } from "axios";
import { claimCoupon } from "./services/couponService";
import { Helmet } from "react-helmet";
import { AppContext, defaultAppContext } from './AppContext';
import NotificationHandler from "./components/notification/NotificationHandler";

function App() {

    const [contextState, setContextState] = useState(defaultAppContext)

    const [error, setError] = useState<any>()
    const [pages, setPages] = useState<Page[]>([])

    const updatePage = (page: Page) => setPages(prev => [...prev.filter(p => p._id !== page._id), page])

    // Authentication
    useEffect(() => {
        profileRequest()
            .then(onLogin)
            .catch(err => {
                // TODO: Option to login on other responses?
                const status = err?.response?.status;
                if (status === 403 || status === 404) {
                    // TODO: replace with iframe form. CORS won't allow this
                    registerRequest()
                        .then(onLogin)
                        .catch(_err => setError('Could not register a new account. Something went wrong :('))
                } else {
                    window.alert(`Something went wrong :(\nError: ${err?.response.body || err.toString()}`)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onLogin = (res: AxiosResponse) => {
        setContextState({ ...contextState, user: res.data })
        const query = new URLSearchParams(window.location.search)
        const id = query.get('business') || query.get('businessID')
        if (!id || id.length !== 24) {
            if (!error && businessId.length !== 24) {
                window.alert('Invalid businessID (' + businessId + ')')
            }
        } else {
            setBusinessId(id)
        }
        const couponCode = query.get('coupon') || query.get('code')
        const checkCoupon = async () => couponCode && claimCoupon(couponCode)
        checkCoupon()
            .then(loadPages)
            .catch(err => setError(err?.response.body?.message || err.toString))
    }

    // Load pages
    const loadPages = () => {
        getPages()
            .then(res => refreshHtmlPages(res.data))
            .catch(err => {
                console.log(err)
                setError('Failed to load pages')
            })
    }

    const refreshHtmlPages = (refreshPages = pages) => {
        if (refreshPages.length) {
            const fetchRest = (excludeId?: string) => refreshPages.forEach(it => it._id !== excludeId && fetchHtml(it))
            // Fetch the current page first for better performance
            const path = window.location.pathname.substring(1) // e.g "/home" -> "home"
            const current = refreshPages.find(page => page.pathname === path)
            if (current) {
                fetchHtml(current).then(() => fetchRest(current._id))
            } else {
                fetchRest()
            }
        }
    }

    const fetchHtml = async (page: Page) => {
        try {
            const res = await getPageHtml(page._id)
            page.html = res.data
        } catch (err) {
            console.log(err)
            page.html = ERROR_HTML
        } finally {
            updatePage(page)
        }
    }

    return (
        <AppContext.Provider value={contextState}>
            <div className="App">

                <Helmet>
                    <link id="favicon" rel="icon" href={`${getBusinessUrl(true)}/icon`} type="image/x-icon"/>
                </Helmet>

                <NotificationHandler onRefresh={refreshHtmlPages}/>
                {error && <p className="ErrorMessage">Error: {error.response?.message || error.toString()}</p>}
                <Switch>
                    {pages.map(page => (
                        <Route exact path={`/${page.pathname}`} key={page._id}>
                            <PageView page={page}/>
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

export default App;
