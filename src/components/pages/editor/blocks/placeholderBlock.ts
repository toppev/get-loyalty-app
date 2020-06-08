import { isFullscreen } from "../../../../util/Fullscreen";

const loyaltyPlaceholder = "loyalty-placeholder";

function addPlaceholderBlock(blockManager: any) {
    blockManager.add(loyaltyPlaceholder, {
        label: `Placeholder`,
        content: `<span class="loyalty-placeholder">{{ NOT SELECTED }}</span>`,
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
        // The block added by #addPlaceholderBlock
        if (classes?.models?.length && classes.models[0].id === loyaltyPlaceholder) {
            // Workaround: If fullscreen enabled, exit so the user sees the dialog
            // And go back to fullscreen after selecting the placeholder
            const fullscreen = isFullscreen();
            if (fullscreen) editor.stopCommand('fullscreen');
            selectPlaceholder((placeholder?: string) => {
                if (fullscreen) editor.runCommand('fullscreen')
                if (placeholder) component.set({ content: placeholder, editable: false });
                else component.remove()
            })
        }
    })
}

export type SelectPlaceholderCallback = (placeholder?: string) => any

export {
    addPlaceholderBlock,
    registerListener,
}