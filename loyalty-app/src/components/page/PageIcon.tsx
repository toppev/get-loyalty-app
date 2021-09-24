import React from "react"
import Page from "../../model/Page"

interface PageIconProps extends React.HTMLProps<HTMLDivElement> {
  page: Page
}

export default function PageIcon(props: PageIconProps) {
  const { page, ...htmlProps } = props
  const icon = page.icon || `<a>${page.pathname}</a>`

  return (
    <div className="block w-8 pageIcon" dangerouslySetInnerHTML={{ __html: icon }} {...htmlProps}/>
  )

}
