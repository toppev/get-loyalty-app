import React, { HTMLProps } from "react";


export default function (props: HTMLProps<HTMLIFrameElement>) {

    return (
        <iframe
            title="Preview"
            style={{ backgroundColor: 'white' }}
            height={720}
            width={360}
            {...props}
        />
    )
}