import React, { useEffect } from "react";
import Page from "../model/Page";
import { NavLink, useLocation } from "react-router-dom";
import PageIcon from "./PageIcon";

interface NavbarProps {
    pages: Page[]
}

export default function (props: NavbarProps) {
    const { pages } = props

    const location = useLocation();
    useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [location])

    return pages?.length > 1 ? (
        <nav className="navbar">
            {pages?.map(page => (
                <NavLink key={page._id} to={page.pathname + window.location.search} className="navlink">
                    <PageIcon page={page}/>
                </NavLink>
            ))}
        </nav>
    ) : null
}