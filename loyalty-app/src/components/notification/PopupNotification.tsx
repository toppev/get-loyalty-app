import React from "react"

import './PopupNotification.css'

export interface Notification {
  message: string
  status?: "success" | "error" | "neutral"
  refresh?: boolean
  vibrate?: number | number[] | boolean
  duration?: number
}

interface NotificationProps {
  notification?: Notification
}

export default function PopupNotification({ notification }: NotificationProps) {

  const { message, status } = { status: "neutral", ...notification }

  const statusColor = status === 'error' ? '#B13C3CFF' : '#44C997'

  return (
    <div className={`notification ${status} ${notification ? 'active' : ''}`}>
      <div className="m-auto">
        <div className="bg-white rounded-lg border-gray-300 border p-4 shadow-lg">
          <div className="flex flex-row">
            <div className="px-2">
              <svg width="24" height="24" viewBox="0 0 1792 1792" fill={statusColor} xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>
              </svg>
            </div>
            <div className="ml-2 mr-6 text-left text-xl">
              {!!message && message.split('\n').map((line, i) => (
                <p className={i === 0 ? 'font-semibold text-gray-700' : 'block text-gray-500'}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
