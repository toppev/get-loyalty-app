import React, { useEffect } from "react";
import Page, { LOADING_HTML } from "../model/Page";
import { replaceQRCodes } from "../modules/QRCode";
import { useUserFormInitialValues } from "../modules/userForm";

interface PageViewProps {
    page: Page
}

export default function (props: PageViewProps) {

    const { page } = props
    const { externalURL, pathname: title } = page

    const html = page.html || LOADING_HTML

    useEffect(replaceQRCodes, [html]);
    useUserFormInitialValues()

    return externalURL ? (
        <div className="page-holder">
            <iframe title={title.charAt(0).toUpperCase() + title.slice(1)} height="100%" width="100%" frameBorder="0" src={externalURL}/>
        </div>
    ) : (
        <div className="page-view" dangerouslySetInnerHTML={{ __html: html }}/>
    )
}