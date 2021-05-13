import React, { useEffect, useState } from "react"
import Page, { LOADING_HTML } from "../model/Page"
import { useUserFormInitialValues } from "../modules/userForm"
import { ON_PAGE_RENDER_MODULES } from "../modules"
import { Helmet } from "react-helmet"
import { getPageStaticFile } from "../services/pageService"

interface PageViewProps {
  page: Page
}

export default function PageView(props: PageViewProps) {

  const { page } = props
  const { externalURL, pathname: title } = page

  const html = page.html || LOADING_HTML

  useEffect(() => ON_PAGE_RENDER_MODULES.forEach(it => it({ page })), [html, page])
  useUserFormInitialValues()

  return externalURL ? (
    <div className="page-holder">
      <iframe title={title} height="100%" width="100%" frameBorder="0" src={externalURL}/>
    </div>
  ) : (
    <>
      <PageHead page={page}/>
      <div className="page-view" dangerouslySetInnerHTML={{ __html: html }}/>
    </>
  )
}

function PageHead({ page }: PageViewProps) {
  const pageId = page._id

  const [script, setScript] = useState("")

  useEffect(() => {
    const fileName = 'main.js'
    getPageStaticFile(pageId, fileName)
      .then(it => setScript(it.data))
      .catch(() => console.log(`Failed to load external static head file: ${fileName}`))
  }, [pageId])

  return (
    <Helmet>
      <script>{script}</script>
    </Helmet>
  )
}
