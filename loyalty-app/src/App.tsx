import React, { useState } from 'react'
import './App.css'
import { getPageHtml, getPages } from "./services/pageService"
import Page, { EMPTY_PAGE_HTML, ERROR_HTML, LOADING_HTML } from "./model/Page"
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
import { usePageUpdates } from "./modules/pageUpdate"

function App() {

  const initContext = defaultAppContext
  initContext.set = data => setContextState(prev => ({ ...prev, ...data }))
  const [contextState, setContextState] = useState<AppContextInterface>(initContext)

  const [error, setError] = useState<string | undefined>()
  const [pages, setPages] = useState<Page[]>([])
  const [registerForm, setRegisterForm] = useState(false)

  const isMobile = useIsMobile()

  // If user exists in context but does not have email, open the registration form if not already
  if (contextState.user?.id && !contextState.user.email) {
    if (!registerForm) {
      isRegistrationFormEnabled().then(res => setRegisterForm(res))
    }
  } else if (registerForm) {
    setRegisterForm(false)
  }

  const updatePage = (page: Page) => setPages(prev => {
    const newPages = [...prev]
    const index = prev.findIndex(old => old._id === page._id)
    if (index !== -1) {
      newPages[index] = page
    } else {
      newPages.push(page)
    }
    return newPages
  })

  const onLogin = (res: AxiosResponse, _data: LoginData) => {
    contextState.set({ user: res.data })
    const query = new URLSearchParams(window.location.search)
    const couponCode = query.get('coupon') || query.get('code')
    const referrer = query.get('referrer')
    const checkCoupon = async () => couponCode && claimCoupon(couponCode, referrer)
    checkCoupon()
      .then(loadPages)
      .catch(err => setError(err?.response.data?.message || err.toString()))
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

  const refreshHtmlPages = (refreshPages: Page[] = pages) => {
    if (!refreshPages.length) refreshPages = pages
    const fetchRest = (excludeId?: string) =>
      refreshPages.forEach(it => it._id !== excludeId && fetchHtml(it))
    // Attempt fetching only the current page first for better performance
    const path = window.location.pathname.substring(1) // e.g "/home" -> "home"
    const current = refreshPages.find(page => page.pathname === path) || refreshPages[0]
    if (current) {
      fetchHtml(current).then(() => fetchRest(current._id))
    } else {
      fetchRest()
    }
  }

  const fetchHtml = async (page: Page) => {
    try {
      const res = await getPageHtml(page._id)
      page.html = res.data || EMPTY_PAGE_HTML
    } catch (err) {
      console.log(err)
      // Do not show error if it just failed to update (i.e., lost internet)
      if (page.html === LOADING_HTML) {
        page.html = ERROR_HTML
      }
    } finally {
      updatePage(page)
    }
  }

  usePageUpdates(refreshHtmlPages)

  const anyError = error || loginError

  return (
    <Router>
      <AppContext.Provider value={contextState}>
        <div className="App">
          <Helmet>
            <link id="favicon" rel="icon" href={`${BASE_URL}/business/icon?size=32`} type="image/x-icon"/>

            {window.location.hostname === "localhost" &&
              <link rel="stylesheet" href="http://localhost:3001/page/common/static/main.css"/>
            }
            {window.location.hostname === "localhost" &&
              <script src="http://localhost:3001/page/common/static/main.js"></script>
            }
          </Helmet>

          {anyError && <p className="ErrorMessage">{anyError}</p>}

          {/* Before the pages so userForm element ids work correctly even if the pages have the same ids */}
          {registerForm && <RegisterForm pages={pages}/>}

          <Pages pages={pages} mobileView={isMobile}/>

          <ReferrerDialog
            user={contextState.user}
            referUrl={window.location.origin + `?coupon=referral?referrer=${contextState.user?.id}`}
          />
          <NotificationHandler onRefresh={refreshHtmlPages}/>
        </div>
      </AppContext.Provider>
    </Router>
  )
}

export default App
