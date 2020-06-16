import React from "react";
import Page from "../model/Page";
import { Link } from "react-router-dom";
import PageIcon from "./PageIcon";

interface NavbarProps {
    pages: Page[]
}

export default function (props: NavbarProps) {
    const { pages } = props

    return pages?.length > 1 ? (
        <nav className="navbar">
            {pages?.map(page => (
                <Link to={page.pathname} key={page._id}>
                    <PageIcon page={page}/>
                </Link>
            ))}
        </nav>
    ) : null
}