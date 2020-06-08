import { renderToStaticMarkup } from "react-dom/server";
import AccountBox from '@material-ui/icons/AccountBox';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import PhoneIcon from '@material-ui/icons/MobileFriendly';
import PagesIcon from '@material-ui/icons/Pages';
import React from "react";

const IconElements: JSX.Element[] = [
    <AccountBox fontSize="large"/>,
    <PeopleIcon fontSize="large"/>,
    <HomeIcon fontSize="large"/>,
    <PhoneIcon fontSize="large"/>,
    <PagesIcon fontSize="large"/>,

]

export default IconElements.map(it => renderToStaticMarkup(it))