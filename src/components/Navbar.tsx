import React from "react";
import Page from "../model/Page";
import { Link } from "react-router-dom";
import PageIcon from "./PageIcon";

interface NavbarProps {
    pages: Page[]
}

export default function (props: NavbarProps) {
    const { pages } = props

    return (
        <div className="navbar">
            {pages?.map(page => (
                <Link to={page.pathname}>
                    <PageIcon page={page} key={`icon_${page._id}`}/>
                </Link>
            ))}
        </div>
    )
}