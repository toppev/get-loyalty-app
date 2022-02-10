import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import AccountBox from '@mui/icons-material/AccountBox'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PeopleIcon from '@mui/icons-material/People'
import HomeIcon from '@mui/icons-material/Home'
import PhoneIcon from '@mui/icons-material/MobileFriendly'
import PagesIcon from '@mui/icons-material/Pages'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import CakeIcon from '@mui/icons-material/Cake'
import BusinessIcon from '@mui/icons-material/Business'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay'
import CallIcon from '@mui/icons-material/Call'
import ChatIcon from '@mui/icons-material/Chat'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast'
import GradeIcon from '@mui/icons-material/Grade'
import HelpIcon from '@mui/icons-material/Help'
import ImageIcon from '@mui/icons-material/Image'
import InfoIcon from '@mui/icons-material/Info'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import MapIcon from '@mui/icons-material/Map'
import SettingsIcon from '@mui/icons-material/Settings'
import StoreIcon from '@mui/icons-material/Store'
import TodayIcon from '@mui/icons-material/Today'

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
