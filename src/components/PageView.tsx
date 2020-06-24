import React from "react";
import Page from "../model/Page";
import { getPageHtmlSource } from "../services/pageService";

interface PageViewProps {
    page: Page
}

export default function (props: PageViewProps) {
    const { page } = props

    return (
        <div className="page-holder">
            <iframe height="100%" width="100%" frameBorder="0" title={page.pathname} src={getPageHtmlSource(page._id)}/>
        </div>
    )
}