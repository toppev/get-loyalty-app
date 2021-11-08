import React, { useState } from 'react'
import './App.css'
import { getPageHtml, getPages } from "./services/pageService"
import Page, { EMPTY_PAGE_HTML, ERROR_HTML } from "./model/Page"
import { BrowserRouter as Router } from "react-router-dom"
import { BASE_URL } from "./config/axios"
import { AxiosResponse } from "axios"
import { claimCoupon } from "./services/couponService"
import { Helmet } from "react-helmet"
import { AppContext, AppContextInterface, defaultAppContext } from './AppContext'
import NotificationHandler from "./components/notification/NotificationHandler"
import { ReferrerDialog } from "./modules/Referrer"
import useIsMobile from "./hooks/useIsMobile"
import { LoginData, useLoginHook } from "./hooks/useLoginHook"
import Pages from "./components/page/Pages"
import { isRegistrationFormEnabled } from "./services/businessService"
import RegisterForm from "./components/user/RegisterForm"
import { useUserFormInitialValues } from "./modules/userForm"

function App() {

  const [contextState, setContextState] = useState<AppContextInterface>(defaultAppContext)

  const [error, setError] = useState<string | undefined>()
  const [pages, setPages] = useState<Page[]>([])
  const [registerForm, setRegisterForm] = useState(false)

  useUserFormInitialValues()

  const isMobile = useIsMobile()

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

  const onLogin = (res: AxiosResponse, data: LoginData) => {
    setContextState({ ...contextState, user: res.data })
    const query = new URLSearchParams(window.location.search)
    const couponCode = query.get('coupon') || query.get('code')
    const referrer = query.get('referrer')
    const checkCoupon = async () => couponCode && claimCoupon(couponCode, referrer)
    checkCoupon()
      .then(loadPages)
      .catch(err => setError(err?.response.body?.message || err.toString()))
    // Either did not register now or does not have email (e.g., refresh) = prompt dialog
    if (data.isRegistration || !res.data.email) {
      // This could be optimized
      // I.e., get only one field or the login form HTML (and empty if disabled)
      isRegistrationFormEnabled().then(res => setRegisterForm(res))
    }
  }

  const { error: loginError } = useLoginHook({ onLogin })

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
      page.html = res.data || EMPTY_PAGE_HTML
    } catch (err) {
      console.log(err)
      page.html = ERROR_HTML
    } finally {
      updatePage(page)
    }
  }

  const firstPagePath = window.location.origin + "/" + (pages.length ? pages[0].pathname : "")

  const anyError = error || loginError

  return (
    <Router>
      <AppContext.Provider value={contextState}>
        <div className="App">
          <Helmet>
            <link id="favicon" rel="icon" href={`${BASE_URL}/business/icon`} type="image/x-icon"/>
          </Helmet>

          {anyError && <p className="ErrorMessage">Error: {anyError}</p>}

          {/* Before the pages so userForm element ids work correctly even if the pages have the same ids */}
          {registerForm && <RegisterForm pages={pages}/>}

          <Pages pages={pages} mobileView={isMobile}/>

          <ReferrerDialog
            user={contextState.user}
            referUrl={`${firstPagePath}?coupon=referral?referrer=${contextState.user?.id}`}
          />
          <NotificationHandler onRefresh={refreshHtmlPages}/>
        </div>
      </AppContext.Provider>
    </Router>
  )
}

export default App
