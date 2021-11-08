import React, { useEffect, useState } from "react"
import Page, { LOADING_HTML } from "../../model/Page"
import { useUserFormInitialValues } from "../../modules/userForm"
import { ON_PAGE_RENDER_MODULES } from "../../modules"
import { Helmet } from "react-helmet"
import { getPageStaticFile } from "../../services/pageService"
import { BASE_URL } from "../../config/axios"

interface PageViewProps {
  page: Page
}

export default function PageView(props: PageViewProps) {

  const { page } = props
  const { externalPage, pathname: title } = page

  const html = page.html || LOADING_HTML

  useEffect(() => ON_PAGE_RENDER_MODULES.forEach(it => it({ page })), [html, page])
  useUserFormInitialValues()

  const externalUrlType = externalPage?.urlType
  const externalUrl = externalPage?.url

  if (externalUrlType === "external_link") {
    if (externalUrl && window.confirm(`You're about to navigate to external page ${externalUrl}`)) {
      window.open(externalUrl, '_blank')
    }
  }

  return externalUrlType === 'iframe' ? (
    <div className="page-holder">
      <iframe title={title} height="100%" width="100%" frameBorder="0" src={externalUrl}/>
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

  // FIXME: currently all scripts are always loaded, maybe we should only load it once the specific page is opened

  useEffect(() => {
    const fileName = 'main.js'
    getPageStaticFile(pageId, fileName)
      .then(it => setScript(it.data))
      .catch(err => console.log(`Failed to load external static head file: ${fileName}`, err))
  }, [pageId])

  return (
    <Helmet>
      <script>{script}</script>

      <link
        rel="stylesheet"
        href={`${BASE_URL}/page/${pageId}/static/main.css`}
        crossOrigin="anonymous"
      />

    </Helmet>
  )
}
