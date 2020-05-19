import GrapesJS from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsTabs from 'grapesjs-tabs';
import grapesjsTouch from 'grapesjs-touch';
import 'grapesjs/dist/css/grapes.min.css';
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, post } from "../../../config/axios";
import AppContext from '../../../context/AppContext';
import Alert from "@material-ui/lab/Alert";
import { addPlaceholderBlock, registerListener } from "./grapesPlaceholderBlock";

// So the editor is not rendered every time if the page id didn't change
export default React.memo(GrapesPageEditor, propsAreEqual);

function propsAreEqual(prev, next) {
    return prev.page._id === next.page._id;
}

function GrapesPageEditor(props) {

    const url = BASE_URL + "/page";

    const appContext = useContext(AppContext);

    const [savingError, setSavingError] = useState('');

    useEffect(() => {
        const editor = GrapesJS.init({
            container: `#page-editor`,
            canvas: {
                styles: ["./editorCanvas.css"]
            },
            plugins: [
                gjsBlocksBasic,
                grapesjsTabs,
                grapesjsTouch,
                //grapesjs-tui-image-editor?
            ],
            storageManager: {
                type: 'remote',
                stepsBeforeSave: 5,
                // Either save or create if undefined
                urlStore: `${url}/${props.page._id || ""}/?gjsOnly=true`,
                urlLoad: `${url}/${props.page._id}/?gjsOnly=true`,
            }
        });

        // By default open the blocks view
        editor.runCommand('core:open-blocks');

        addPlaceholderBlock(editor.BlockManager);

        registerListener(editor, props.selectPlaceholder);

        editor.on('storage:store', () => {
            post(`/business/${appContext.business._id}/page/${props._id}/upload`, {
                html: editor.getHtml(),
                css: editor.getCss()
            }).then().catch(err => {
                setSavingError(err?.response?.message || `Check internet connection. ${err}`)
            });
        });

        return function () {
            if (editor.getDirtyCount()) {
                editor.store();
            }
        }
    });

    return (
        <div>
            {savingError && <Alert severity="error">Failed to save the page! {savingError}</Alert>}
            <div id="page-editor"/>
        </div>
    )
}