import GrapesJS from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsTabs from 'grapesjs-tabs';
import grapesjsTouch from 'grapesjs-touch';
import grapesjsTuiImageEditor from 'grapesjs-tui-image-editor';
import 'grapesjs/dist/css/grapes.min.css';
import React, { useEffect } from "react";
import { getBusinessUrl } from "../../../config/axios";
import { addPlaceholderBlock, registerListener } from "./blocks/placeholderBlock";
import { addCampaignsBlock } from "./blocks/campaignBlock";
import { addUserRewardsBlock } from "./blocks/userRewardsBlock";
import Cookie from "js-cookie";
import { uploadHtmlCss } from "../../../services/pageService";
import { addRichTextEditorPlaceholders } from "./blocks/richPlaceholder";
import { usePlaceholderContext } from "./placeholderContext";

// So the editor is not rendered every time if the page id didn't change
export default React.memo(GrapesPageEditor, propsAreEqual);

function propsAreEqual(prev, next) {
    return prev.page._id === next.page._id;
}

function GrapesPageEditor(props) {

    const url = getBusinessUrl() + "/page";
    const placeholderContext = usePlaceholderContext()

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
                grapesjsTuiImageEditor
            ],
            storageManager: {
                type: 'remote',
                stepsBeforeSave: 5,
                // Either save or create if undefined
                urlStore: `${url}/${props.page._id || ""}/?gjsOnly=true`,
                urlLoad: `${url}/${props.page._id}/?gjsOnly=true`,
                headers: {
                    'x-xsrf-token': Cookie.get('XSRF-TOKEN')
                }
            }
        });

        // Open the blocks view
        editor.runCommand('core:open-blocks');
        editor.on('load', () => {
            editor.setDevice("Mobile portrait")
        })


        editor.on('storage:start:store', () => {
            uploadHtmlCss(props.page, editor.getHtml(), editor.getCss())
                .then(() => props.setError())
                .catch(err => {
                    props.setError(err?.response?.message || `Oops... Something went wrong. ${err}`, editor.store)
                });
        });

        // Add custom blocks
        const bm = editor.BlockManager;
        addPlaceholderBlock(bm);
        registerListener(editor, props.selectPlaceholder);

        addCampaignsBlock(bm);
        addUserRewardsBlock(bm);
        addRichTextEditorPlaceholders(editor, placeholderContext);

        const saveIfNeeded = () => {
            console.log(editor.getDirtyCount());
            if (editor.getDirtyCount()) {
                editor.store()
            }
        }

        /* Currently disabled because editor#getDirtyCount does not reset for some reason

        let timeout = setTimeout(autosave, 10000);

        // Auto-save every 5 seconds
        function autosave() {
            saveIfNeeded()
            timeout = setTimeout(autosave, 5000);
        }
        */

        // Save when closing
        return function () {
            // clearInterval(timeout);
            saveIfNeeded();
        }
    });

    return (
        <div>
            <div id="page-editor"/>
        </div>
    )
}