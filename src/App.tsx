import React, { useEffect, useState } from 'react';
import './App.css';
import { getPages } from "./services/pageService";
import Page from "./model/Page";
import PageView from "./components/PageView";
import { profileRequest, registerRequest } from "./services/authenticationService";
import { Redirect, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { businessId, setBusinessId } from "./config/axios";
import { AxiosResponse } from "axios";
import { claimCoupon } from "./services/couponService";

function App() {

    const [error, setError] = useState<any>()
    const [pages, setPages] = useState<Page[]>([])

    // Authentication
    useEffect(() => {
        profileRequest()
            .then(onLogin)
            .catch(err => {
                // TODO: Option to login on other responses?
                const status = err?.response?.status;
                if (status === 403 || status === 404) {
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
        <div className="App">
            {error && <p className="ErrorMessage">Error: {error.response?.message || error.toString()}</p>}
            <Switch>
                {pages?.map(page => (
                    <Route exact path={`/${page.pathname}`} key={page._id}>
                        <PageView page={page}/>
                    </Route>
                ))}
                {pages.length > 0 && <Redirect to={{ pathname: pages[0].pathname, search: window.location.search }}/>}
            </Switch>
            <Navbar pages={pages || []}/>
        </div>
    )
}

export default App
