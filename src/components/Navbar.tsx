import React from "react";
import Page from "../model/Page";
import { NavLink } from "react-router-dom";
import PageIcon from "./PageIcon";

interface NavbarProps {
    pages: Page[]
}

export default function (props: NavbarProps) {
    const { pages } = props

    return pages?.length > 1 ? (
        <nav className="navbar">
            {pages?.map(page => (
                <NavLink key={page._id} to={page.pathname + window.location.search}>
                    <PageIcon page={page}/>
                </NavLink>
            ))}
        </nav>
    ) : null
}