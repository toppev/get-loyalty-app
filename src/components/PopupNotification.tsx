import React from "react";

import '../Notification.css';

export interface Notification {
    message: string
    status?: "success" | "error" | "neutral"
    refresh?: boolean
    vibrate: number | number[] | boolean
}

interface NotificationProps {
    notification?: Notification
}

export default function ({ notification }: NotificationProps) {

    const { message, status } = { status: "neutral", ...notification }

    return (
        <div className={`notification ${status} ${notification ? 'active' : ''}`}>
            <p>{message}</p>
        </div>
    )
}