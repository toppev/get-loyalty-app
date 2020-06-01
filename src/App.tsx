import React, { useEffect, useState } from 'react';
import './App.css';
import { getPageHtml, getPages } from "./services/pageService";
import Page, { ERROR_HTML } from "./model/Page";
import PageView from "./components/PageView";
import { profileRequest, registerRequest } from "./services/authenticationService";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {

    const [error, setError] = useState<string | undefined>()
    const [pages, setPages] = useState<Page[]>()

    const updatePage = (page: Page) => setPages([...(pages?.filter(p => p._id !== page._id) || []), page])

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

    // Authentication
    // TODO: somehow get the business id?
    useEffect(() => {
        profileRequest()
            .then(() => loadPages())
            .catch(err => {
                // TODO: Option to login on other responses?
                if (err.response?.status == 403) {
                    registerRequest()
                        .then(() => loadPages)
                }
            })
    }, [])

    // Loading page content
    useEffect(() => {
        // For slightly better performance, load the first page (landing page) first
        if (pages?.length) {
            const first = pages[0]
            fetchHtml(first).then(() => pages.forEach(fetchHtml))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages])

    return (
        <div className="App">
            {error && <p className="ErrorMessage">Error</p>}
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
