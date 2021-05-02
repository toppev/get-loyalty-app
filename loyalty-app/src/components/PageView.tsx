import React, { useEffect } from "react"
import Page, { LOADING_HTML } from "../model/Page"
import { useUserFormInitialValues } from "../modules/userForm"
import { ON_PAGE_RENDER_MODULES } from "../modules"
import { Helmet } from "react-helmet"
import { getTextBetween } from "../util/stringUtils"

interface PageViewProps {
  page: Page
}

export default function PageView(props: PageViewProps) {

  const { page } = props
  const { externalURL, pathname: title } = page

  const html = page.html || LOADING_HTML
  const head = page.head || ""

  useEffect(() => ON_PAGE_RENDER_MODULES.forEach(it => it({ page })), [html, page])
  useUserFormInitialValues()

  return externalURL ? (
    <div className="page-holder">
      <iframe title={title} height="100%" width="100%" frameBorder="0" src={externalURL}/>
    </div>
  ) : (
    <>
      <Helmet>
        <script>{getTextBetween(head, "<script>", "</script>")}</script>
      </Helmet>
      <div className="page-view" dangerouslySetInnerHTML={{ __html: html }}/>
    </>
  )
}


