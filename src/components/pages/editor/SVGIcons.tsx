import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import AccountBox from '@material-ui/icons/AccountBox';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import PhoneIcon from '@material-ui/icons/MobileFriendly';
import PagesIcon from '@material-ui/icons/Pages';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import CakeIcon from '@material-ui/icons/Cake';
import BusinessIcon from '@material-ui/icons/Business';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import CallIcon from '@material-ui/icons/Call';
import ChatIcon from '@material-ui/icons/Chat';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import GradeIcon from '@material-ui/icons/Grade';
import HelpIcon from '@material-ui/icons/Help';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import MapIcon from '@material-ui/icons/Map';
import SettingsIcon from '@material-ui/icons/Settings';
import StoreIcon from '@material-ui/icons/Store';
import TodayIcon from '@material-ui/icons/Today';

const IconElements: JSX.Element[] = [
    <AccountBox fontSize="large"/>,
    <AccountCircleIcon fontSize="large"/>,
    <PeopleIcon fontSize="large"/>,
    <HomeIcon fontSize="large"/>,
    <StoreIcon fontSize="large"/>,
    <PhoneIcon fontSize="large"/>,
    <PagesIcon fontSize="large"/>,
    <AnnouncementIcon fontSize="large"/>,
    <CakeIcon fontSize="large"/>,
    <FastfoodIcon fontSize="large"/>,
    <FreeBreakfastIcon fontSize="large"/>,
    <LocalOfferIcon fontSize="large"/>,
    <CalendarTodayIcon fontSize="large"/>,
    <TodayIcon fontSize="large"/>,
    <CalendarViewDayIcon fontSize="large"/>,
    <BusinessIcon fontSize="large"/>,
    <CallIcon fontSize="large"/>,
    <ChatIcon fontSize="large"/>,
    <GradeIcon fontSize="large"/>,
    <HelpIcon fontSize="large"/>,
    <InfoIcon fontSize="large"/>,
    <ImageIcon fontSize="large"/>,
    <MapIcon fontSize="large"/>,
    <SettingsIcon fontSize="large"/>,

]

export default IconElements.map(it => renderToStaticMarkup(it))