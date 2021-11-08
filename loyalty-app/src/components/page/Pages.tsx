import React, { useEffect, useState } from 'react'
import SwipeableViews from "react-swipeable-views"
import PageView from "./PageView"
import Navbar from "../navbar/Navbar"
import Page from "../../model/Page"


interface PagesProps {
  mobileView: boolean
  pages: Page[]
}

export default function Pages(props: PagesProps) {

  const { mobileView, pages } = props

  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageName = params.get('page')?.toLowerCase()
    const page = pages?.findIndex(it => it.pathname?.toLowerCase() === pageName)
    if (page >= 0 && pageIndex !== page) setCurrentPage(page)
  }, [pages, pageIndex])

  const setCurrentPage = (index: number) => {
    const newPath = pages[index]?.pathname
    setPageIndex(index)
    // @ts-ignore
    window.history.replaceState(null, null, "?page=" + newPath)
  }

  return (
    <>
      <Navbar
        mobileNavbar={mobileView}
        pages={pages || []}
        currentPageIndex={pageIndex}
        setCurrentPageIndex={setCurrentPage}
      />
      <div id="pages">
        <SwipeableViews
          enableMouseEvents
          index={pageIndex}
          onChangeIndex={setCurrentPage}
        >
          {filterPages(pages).map(page => (
            <PageView key={page._id} page={page}/>
          ))}
        </SwipeableViews>
      </div>
    </>
  )
}

function filterPages(pages: Page[]): Page[] {
  const excluded = ['registration']
  return pages.filter(it => !it.hidden && !excluded.includes(it.pathname))
}
