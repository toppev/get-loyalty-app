const enableNotificationsClass = "enable-notifications"

function addEnableNotificationsButton(blockManager: any) {
    blockManager.add(enableNotificationsClass, {
        label: `Enable Notifications`,
        content: (
            `<button
                class="${enableNotificationsClass}"
                style="
                    background-color: mediumturquoise;
                    border-radius: 4px;
                    padding: 6px 20px;
                    margin: 0;
                    cursor: pointer;
                    border: 1px solid #bbb;
                    overflow: visible;
                    text-decoration: none;"
            >Enable Notifications</button>`
        ),
    });
}

export {
    addEnableNotificationsButton
}