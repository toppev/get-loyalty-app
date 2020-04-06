import { makeStyles, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GrapesJS from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsTabs from 'grapesjs-tabs';
import grapesjsTouch from 'grapesjs-touch';
import 'grapesjs/dist/css/grapes.min.css';
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, post } from "../../config/axios";
import AppContext from '../../context/AppContext';

// So the editor is not rerendered every time if the page id didn't change
export default React.memo(PageEditor, propsAreEqual);

function propsAreEqual(prev, next) {
    return prev.page._id === next.page._id;
}

const useStyles = makeStyles({
    enableEditor: {
        textAlign: 'center',
        color: 'gray'
    },
    enableEditorBtn: {
        color: 'lightblue',
        textTransform: 'lowercase'
    }
});

function PageEditor(props) {

    const url = BASE_URL + "/page";

    const appContext = useContext(AppContext);

    const theme = useTheme();
    const notMobile = useMediaQuery(theme.breakpoints.up('sm'));
    const [forceMobileEditor, setForceMobileEditor] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        const editor = GrapesJS.init({
            container: `#page-editor`,
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

        // TODO: should this be triggered every time
        editor.on('storage:store', () => {
            post(`/business/${appContext.business._id}/page/${props._id}/upload`, {
                html: editor.getHtml(),
                css: editor.getCss()
            }).then((res) => {
                // TODO
            }).catch(_err => {
                // TODO
            });
        })

        return function cleanup() {
            if (editor.getDirtyCount()) {
                editor.store();
            }
        }
    });

    return !notMobile && !forceMobileEditor ? (
        <div>
            <Typography variant="h6" align="center" color="error">
                Unfortunately, the page editor may not work well on mobile devices.
            </Typography>
            <div className={classes.enableEditor}>
                If you want to try it
            <Button
                    size="small"
                    className={classes.enableEditorBtn}
                    onClick={() => setForceMobileEditor(true)}
                >click here</Button>
            </div>
        </div>) : (
            <div id="page-editor"></div>
        )
}