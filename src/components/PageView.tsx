import React from "react";
import Page, { LOADING_HTML } from "../model/Page";

interface PageViewProps {
    page: Page
}

export default function (props: PageViewProps) {
    const { page } = props
    const html = page.html || LOADING_HTML

    return (
        <div dangerouslySetInnerHTML={{ __html: html }}/>
    )
}