import React, { useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useMediaQuery } from 'react-responsive'
import Page from "../../model/Page"
import PageIcon from "../page/PageIcon"

import './Navbar.css'
import { BASE_URL } from "../../config/axios"

interface NavbarProps {
  pages: Page[]
}

export default function Navbar(props: NavbarProps) {
  const { pages } = props

  const location = useLocation()
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [location])

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  // Not enabled if only one page
  if (pages?.length <= 1) return null

  return isTabletOrMobile ? (
    <nav className="mobile-navbar">
      {pages?.map(page => (
        <NavLink key={page._id} to={page.pathname + window.location.search} className="navlink-mobile">
          <PageIcon page={page} style={{ margin: 'auto' }}/>
        </NavLink>
      ))}
    </nav>
  ) : (
    <nav className="desktop-navbar">
      <a href={pages[0].pathname + window.location.search}>
        <img src={`${BASE_URL}/business/icon?size=180`} width="180" alt="" className="navbar-logo"/>
      </a>
      <hr className="navbar-hr"/>
      {pages?.map(page => (
        <NavLink key={page._id} to={page.pathname + window.location.search} className="navlink-desktop">
          <div className="flex">
            <PageIcon page={page}/>
            <span className="navlink-page-name">
              {page.pathname.replace("-", " ")}
            </span>
          </div>
        </NavLink>
      ))}
    </nav>
  )
}
