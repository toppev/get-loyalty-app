import React from "react";
import Page from "../model/Page";
import { getPageHtmlSource } from "../services/pageService";

interface PageViewProps {
    page: Page
    /**
     * Change value of this prop to reload the iframe
     */
    refreshKey?: any
}

export default function (props: PageViewProps) {
    const { page, refreshKey } = props

    // TODO: smoother transition?

    return (
        <div className="page-holder">
            <iframe
                key={refreshKey}
                height="100%"
                width="100%"
                frameBorder="0"
                title={page.pathname}
                src={getPageHtmlSource(page)}
            />
        </div>
    )
}