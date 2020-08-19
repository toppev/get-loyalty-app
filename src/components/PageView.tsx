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

    return (
        <div className="page-view" dangerouslySetInnerHTML={{ __html: html }}/>
    )
}