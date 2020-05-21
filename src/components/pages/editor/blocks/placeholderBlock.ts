import { isFullscreen } from "../../../../util/Fullscreen";

function addPlaceholderBlock(blockManager: any) {
    blockManager.add(`loyally-placeholder`, {
        label: `Placeholder`,
        textable: true,
        content: `<span class="loyally-placeholder">{{ NOT SELECTED }}</span>`,
        // Too lazy to fix the label
        render: ({ model }: any) => `<div><b style="font-size: 22px; word-spacing: 4px">{{ }}</b><div class="gjs-block-label" style="margin-top: 30px;">${model.get('label')}</div></div>`,
    });
}


/**
 * Listener that will trigger the placeholder selector.
 */
function registerListener(editor: any, selectPlaceholder: (callback: SelectPlaceholderCallback) => any) {
    editor.on('component:add', (component: any) => {
        let { classes } = component.attributes;
        // Currently only support the block added by #addPlaceholderBlock
        if (classes?.models?.length && classes.models[0].id === "loyally-placeholder") {
            // If fullscreen, exit so the user sees the dialog
            // And go back to fullscreen after selecting the placeholder
            // Probably not the best way to do this
            const fullscreen = isFullscreen();
            if (fullscreen) {
                editor.stopCommand('fullscreen');
            }
            selectPlaceholder((placeholder?: string) => {
                if (fullscreen) {
                    editor.runCommand('fullscreen');
                }
                if (placeholder) {
                    component.set({ content: placeholder, editable: false });
                } else {
                    // TODO: remove the component
                    component.set({ content: 'Cancelled. Delete me!' });
                }
            })
        }
    })
}

export type SelectPlaceholderCallback = (placeholder?: string) => any

export {
    addPlaceholderBlock,
    registerListener,
}