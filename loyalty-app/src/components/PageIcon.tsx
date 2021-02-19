import React from "react";
import Page from "../model/Page";

import "./Page.css";

interface PageIconProps extends React.HTMLProps<HTMLDivElement> {
    page: Page
}

export default function (props: PageIconProps) {
    const { page, ...htmlProps } = props;
    const icon = page.icon || `<a>${page.pathname}</a>`

    return (
        <div className="pageIcon" dangerouslySetInnerHTML={{ __html: icon }} {...htmlProps}/>
    )

}