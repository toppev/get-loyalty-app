import React from "react"
import Page from "../../model/Page"
import PageIcon from "../page/PageIcon"

import './Navbar.css'
import { BASE_URL } from "../../config/axios"

interface NavbarProps {
  pages: Page[]
  currentPageIndex: number
  setCurrentPageIndex: (i: number) => any
  mobileNavbar: boolean
}

export default function Navbar(props: NavbarProps) {
  const { pages, mobileNavbar } = props

  const isActive = (page: Page) => pages.indexOf(page) === props.currentPageIndex

  const setCurrentPage = (page: Page) => {
    props.setCurrentPageIndex(pages.indexOf(page))
    /*
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 350)
     */
  }

  // Not enabled if only one page
  if (pages?.length <= 1) return null

  return mobileNavbar ? (
    <nav className="mobile-navbar">
      {pages?.map(page => (
        <button
          key={page._id}
          className={"navlink navlink-mobile " + (isActive(page) ? 'active' : '')}
          onClick={() => setCurrentPage(page)}
        >
          <PageIcon page={page} style={{ margin: 'auto' }}/>
          <p className={`text-xs text-gray-${isActive(page) ? '200' : '50'} relative bottom-1`}>{page.name}</p>
        </button>
      ))}
    </nav>
  ) : (
    <nav className="desktop-navbar">
      <div className="desktop-navbar-container">
        <a className="desktop-navbar-icon" href={pages[0].pathname + window.location.search}>
          <img src={`${BASE_URL}/business/icon?size=180`} width="180" alt="" className="navbar-logo"/>
        </a>
        <hr className="navbar-hr"/>
        {pages?.map(page => (
          <button
            key={page._id}
            className={"navlink navlink-desktop " + (isActive(page) ? 'active' : '')}
            onClick={() => setCurrentPage(page)}
          >
            <div className="flex">
              <PageIcon page={page}/>
              <span className="navlink-page-name">
                {page.pathname.replace("-", " ")}
              </span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  )
}
