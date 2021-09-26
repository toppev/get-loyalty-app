import React, { useState } from 'react'
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

  return (
    <>
      <Navbar
        mobileNavbar={mobileView}
        pages={pages || []}
        currentPageIndex={pageIndex}
        setCurrentPageIndex={setPageIndex}
      />
      <div id="pages">
        <SwipeableViews
          enableMouseEvents
          index={pageIndex}
          onChangeIndex={setPageIndex}
        >
          {pages.map(page => (
            <PageView key={page._id} page={page}/>
          ))}
        </SwipeableViews>
      </div>
    </>
  )
}
