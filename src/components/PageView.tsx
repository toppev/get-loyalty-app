import React, { useEffect } from "react";
import Page, { LOADING_HTML } from "../model/Page";
import { replaceQRCodes } from "../util/QRCode";

interface PageViewProps {
    page: Page
}

export default function (props: PageViewProps) {

    const { page } = props
    const html = page.html || LOADING_HTML

    useEffect(replaceQRCodes, [html]);

    return page.externalURL ? (
        <div className="page-holder">
            <iframe height="100%" width="100%" frameBorder="0" src={page.externalURL}/>
        </div>
    ) : (
        <div className="page-view" dangerouslySetInnerHTML={{ __html: html }}/>
    )
}