import React, { useEffect, useState } from 'react'
import './App.css'
import { getPageHtml, getPages } from "./services/pageService"
import Page, { ERROR_HTML } from "./model/Page"
import PageView from "./components/PageView"
import { profileRequest, registerRequest } from "./services/userService"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"
import { BASE_URL } from "./config/axios"
import { AxiosResponse } from "axios"
import { claimCoupon } from "./services/couponService"
import { Helmet } from "react-helmet"
import { AppContext, AppContextInterface, defaultAppContext } from './AppContext'
import NotificationHandler from "./components/notification/NotificationHandler"
import Navbar from "./components/Navbar"
import { ReferrerDialog } from "./modules/Referrer"

function App() {

  const [contextState, setContextState] = useState<AppContextInterface>(defaultAppContext)

  const [error, setError] = useState<string | undefined>()
  const [pages, setPages] = useState<Page[]>([])

  const updatePage = (page: Page) => setPages(prev => {
    let newPages = [...prev]
    let index = prev.findIndex(old => old._id === page._id)
    if (index !== -1) {
      newPages[index] = page
    } else {
      newPages.push(page)
    }
    return newPages
  })

  // Authentication
  useEffect(() => {
    profileRequest()
      .then(onLogin)
      .catch(err => {
        // TODO: Option to login on other responses?
        const status = err?.response?.status
        if (status === 401 || status === 403 || status === 404) {
          registerRequest()
            .then(onLogin)
            .catch(_err => setError('Could not register a new account. Something went wrong :('))
        } else {
          setError(`Something went wrong :(\n${err.response?.body || err.toString()}`)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onLogin = (res: AxiosResponse) => {
    setContextState({ ...contextState, user: res.data })
    const query = new URLSearchParams(window.location.search)
    const couponCode = query.get('coupon') || query.get('code')
    const referrer = query.get('referrer')
    const checkCoupon = async () => couponCode && claimCoupon(couponCode, referrer)
    checkCoupon()
      .then(loadPages)
      .catch(err => setError(err?.response.body?.message || err.toString()))
  }

  // Load pages
  const loadPages = () => {
    getPages()
      .then(res => {
        const newPages = res.data
        setPages(newPages)
        refreshHtmlPages(newPages)
        if (!newPages.length) {
          window.alert("There are no pages available currently. Add or publish pages to get started.")
        }
      })
      .catch(err => {
        console.log(err)
        setError('Failed to load the pages')
      })
  }

  const refreshHtmlPages = (refreshPages = pages) => {
    if (refreshPages.length) {
      const fetchRest = (excludeId?: string) => refreshPages.forEach(it => it._id !== excludeId && fetchHtml(it))
      // Attempt fetching only the current page first for better performance
      const path = window.location.pathname.substring(1) // e.g "/home" -> "home"
      const current = refreshPages.find(page => page.pathname === path) || refreshPages[0]
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

  const firstPagePath = window.location.origin + "/" + (pages.length ? pages[0].pathname : "")

  return (
    <Router>
      <AppContext.Provider value={contextState}>
        <div className="App">
          <Helmet>
            <link id="favicon" rel="icon" href={`${BASE_URL}/business/icon`} type="image/x-icon"/>
          </Helmet>

          {error && <p className="ErrorMessage">Error: {error}</p>}

          <Navbar pages={pages || []}/>
          <ReferrerDialog user={contextState.user} referUrl={`${firstPagePath}?coupon=referral?referrer=${contextState.user?.id}`}/>
          <Switch>
            {pages.map(page => (
              <Route exact path={`/${page.pathname}`} key={page._id}>
                <PageView page={page}/>
              </Route>
            ))}
            {pages.length > 0 &&
            <Redirect to={{ pathname: pages[0].pathname, search: window.location.search }}/>}
          </Switch>
          <NotificationHandler onRefresh={refreshHtmlPages}/>
        </div>
      </AppContext.Provider>
    </Router>
  )
}

export default App
