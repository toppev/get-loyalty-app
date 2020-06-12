import GrapesJS from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsTabs from 'grapesjs-tabs';
import grapesjsTouch from 'grapesjs-touch';
import 'grapesjs/dist/css/grapes.min.css';
import React, { useEffect } from "react";
import { getBusinessUrl } from "../../../config/axios";
import { addPlaceholderBlock, registerListener } from "./blocks/placeholderBlock";
import { addCampaignsBlock } from "./blocks/campaignBlock";
import { addUserRewardsBlock } from "./blocks/userRewardsBlock";
import Cookie from "js-cookie";
import { uploadHtmlCss } from "../../../services/pageService";

// So the editor is not rendered every time if the page id didn't change
export default React.memo(GrapesPageEditor, propsAreEqual);

function propsAreEqual(prev, next) {
    return prev.page._id === next.page._id;
}

function GrapesPageEditor(props) {

    const url = getBusinessUrl() + "/page";

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

                // Add CKEditor?
                // didn't really work :/

                // Add grapesjs-tui-image-editor?
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

        editor.on('storage:start:store', () => {
            uploadHtmlCss(props.page, editor.getHtml(), editor.getCss())
                .catch(err => {
                    props.onSaveFail(err?.response?.message || `Oops... Something went wrong. ${err}`, editor.store)
                });
        });

        // Add custom blocks
        const bm = editor.BlockManager;
        addPlaceholderBlock(bm);
        registerListener(editor, props.selectPlaceholder);

        addCampaignsBlock(bm);
        addUserRewardsBlock(bm);
        //  addRichTextEditorPlaceholders(editor, placeholderContext);

        return function () {
            if (editor.getDirtyCount()) {
                editor.store();
            }
        }
    });

    return (
        <div>
            <div id="page-editor"/>
        </div>
    )
}