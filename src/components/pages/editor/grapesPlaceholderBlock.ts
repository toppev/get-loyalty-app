function addPlaceholderBlock(BlockManager: any) {
    BlockManager.add(`loyally-placeholder`, {
        label: 'Placeholder',
        content: `<span class="loyally-placeholder">TODO</span>`,
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
            selectPlaceholder((placeholder?: string) => {
                if (placeholder) {
                    component.set({ content: placeholder });
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