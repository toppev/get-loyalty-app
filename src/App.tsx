import React, { useEffect, useState } from 'react';
import './App.css';
import { getPageHtml, getPages } from "./services/pageService";
import Page, { ERROR_HTML } from "./model/Page";
import PageView from "./components/PageView";
import { profileRequest, registerRequest } from "./services/authenticationService";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { setBusinessId } from "./config/axios";
import { AxiosResponse } from "axios";
import { claimCoupon } from "./services/couponService";

function App() {

    const [error, setError] = useState<any>()
    const [pages, setPages] = useState<Page[]>([])

    const updatePage = (page: Page) => setPages(prev => [...prev.filter(p => p._id !== page._id), page])

    // Authentication
    useEffect(() => {
        profileRequest()
            .then(onLogin)
            .catch(err => {
                // TODO: Option to login on other responses?
                if (err.response?.status === 403) {
                    registerRequest()
                        .then(onLogin)
                        .catch(_err => setError('Could not register a new account. Something went wrong :('))
                } else {
                    setError('Something went wrong :(')
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onLogin = (_res: AxiosResponse) => {
        checkCoupon()
            .then(loadPages)
            .catch(err => setError(err))
    }

    const query = new URLSearchParams(window.location.search)

    const businessId = query.get('business') || query.get('businessID')
    if (!businessId || businessId.length !== 24) {
        setError('Invalid business')
    } else {
        setBusinessId(businessId)
    }

    const couponCode = query.get('coupon') || query.get('code')
    const checkCoupon = async () => couponCode && claimCoupon(couponCode)

    // Load pages
    const loadPages = () => {
        getPages()
            .then(res => {
                const newPages = res.data
                // For slightly better performance, load the first page (landing page) first
                if (newPages?.length) {
                    const first = newPages[0]
                    fetchHtml(first).then(() => newPages.forEach(fetchHtml))
                }
            })
            .catch(err => {
                console.log(err)
                setError('Failed to load pages')
            })
    }

    const fetchHtml = async (page: Page) => {
        try {
            const res = await getPageHtml(page._id)
            page.html = res.data
            updatePage(page)
        } catch (err) {
            console.log(err)
            page.html = ERROR_HTML
            updatePage(page)
        }
    }

    return (
        <div className="App">
            {error && <p className="ErrorMessage">Error: {error.response?.message || error.toString()}</p>}
            <Router>
                <Switch>
                    {pages?.map(page => (
                        <Route exact path={`/${page.pathname}`} key={page._id}>
                            <PageView page={page}/>
                        </Route>
                    ))}
                    {pages.length > 0 && <Redirect to={pages[0].pathname}/>}
                </Switch>
                <Navbar pages={pages || []}/>
            </Router>
        </div>
    )
}

export default App;
