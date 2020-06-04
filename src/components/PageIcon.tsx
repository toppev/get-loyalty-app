import React from "react";
import Page from "../model/Page";

interface PageIconProps {
    page: Page
}

export default function (props: PageIconProps) {
    const { page } = props;
    const icon = page.icon || `<a>${page.pathname}</a>`

    return (
        <div className="pageIcon" dangerouslySetInnerHTML={{ __html: icon }}/>
    )

}