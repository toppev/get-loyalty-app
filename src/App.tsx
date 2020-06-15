import React, { useEffect, useState } from 'react';
import './App.css';
import { getPageHtml, getPages } from "./services/pageService";
import Page, { ERROR_HTML } from "./model/Page";
import PageView from "./components/PageView";
import { getBusinessId, profileRequest, registerRequest } from "./services/authenticationService";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { setBusinessId } from "./config/axios";
import { AxiosResponse } from "axios";
import { useQuery } from "./useQuery";
import { claimCoupon } from "./services/couponService";

function App() {

    const [error, setError] = useState<any>()
    const [pages, setPages] = useState<Page[]>()

    const updatePage = (page: Page) => setPages([...(pages?.filter(p => p._id !== page._id) || []), page])

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
        getBusinessId()
            .then(bId => {
                if (!bId || bId.length !== 24) {
                    setError('Invalid business')
                } else {
                    setBusinessId(bId)
                }
                checkCoupon()
                    .then(loadPages)
                    .catch(err => setError(err))
            })
            .catch(_err => setError('Failed to identify business :('))
    }

    const query = useQuery();
    const couponCode = query.get('coupon') || query.get('code');
    const checkCoupon = async () => couponCode && claimCoupon(couponCode)

    // Load pages
    const loadPages = () => {
        getPages()
            .then(res => {
                const newPages = res.data
                setPages(newPages) // So the page contents will be loaded
            })
            .catch(err => {
                console.log(err)
                setError('Failed to load pages')
            })
    }

    useEffect(() => {
        // For slightly better performance, load the first page (landing page) first
        if (pages?.length) {
            const first = pages[0]
            fetchHtml(first).then(() => pages.forEach(fetchHtml))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages])

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
                        <Route exact path={page.pathname}>
                            <PageView page={page} key={page._id}/>
                        </Route>
                    ))}
                </Switch>
                <Navbar pages={pages || []}/>
            </Router>
        </div>
    )
}

export default App;
