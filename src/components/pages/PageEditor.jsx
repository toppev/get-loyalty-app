import GrapesJS from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsTabs from 'grapesjs-tabs';
import 'grapesjs/dist/css/grapes.min.css';
import React, { useEffect } from "react";
import { BASE_URL } from "../../config/axios";

export default function (props) {

    const url = BASE_URL + "/page";

    useEffect(() => {
        const editor = GrapesJS.init({
            container: `#page-editor`,
            fromElement: true,
            plugins: [
                gjsBlocksBasic,
                grapesjsTabs,
                //grapesjs-tui-image-editor?
            ],
            storageManager: {
                type: 'remote',
                stepsBeforeSave: 3,
                urlStore: `${url}/${props.id}`,
                urlLoad: `${url}/${props.id}`,
                // For custom parameters/headers on requests
                params: { _some_token: '....' },
                headers: { Authorization: 'Basic ...' },
            }
        });
        return function cleanup() {
            if (editor.getDirtyCount()) {
                editor.store();
            }
        }
    });

    return (
        <>
            <div id="page-editor">
                <h2>Testiii</h2>
            </div>
        </>)
}