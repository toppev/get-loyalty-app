import React from "react"

import './PopupNotification.css'

export interface Notification {
  message: string
  id: any
  status?: "success" | "error" | "neutral"
  refresh?: boolean
  vibrate?: number | number[] | boolean
  duration?: number
}

interface NotificationProps {
  notification?: Notification
}

export default function ({ notification }: NotificationProps) {

  const { message, status } = { status: "neutral", ...notification }

  return (
    <div className={`notification ${status} ${notification ? 'active' : ''}`}>
      {!!message && message.split('\n').map(line => (
        <p>{line}</p>
      ))}
    </div>
  )
}
