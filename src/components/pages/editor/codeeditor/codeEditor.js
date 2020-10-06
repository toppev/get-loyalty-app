import "./codeEditor.css";

/**
 * Adds a code editor (to edit raw HTML/CSS) in the editor.
 */
// Partly stolen from https://github.com/artf/grapesjs/issues/324#issuecomment-330571539
export default function (editor) {
    const stylePrefix = editor.getConfig().stylePrefix;
    const { Modal: modal, Commands: commands, CodeManager: codeManager } = editor;
    const codeViewer = codeManager.getViewer('CodeMirror').clone();

    const container = document.createElement('div');
    const saveBtn = document.createElement('button');


    codeViewer.set({
        codeName: 'htmlmixed',
        readOnly: false,
        autoBeautify: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        smartIndent: true,
        indentWithTabs: true
    });

    saveBtn.innerHTML = 'Save and exit';
    saveBtn.title = 'CTRL + S to save'
    saveBtn.style.marginTop = '5px';
    saveBtn.className = `${stylePrefix}btn-prim ${stylePrefix}btn-import`;
    saveBtn.onclick = () => {
        const code = codeViewer.editor.getValue();
        editor.DomComponents.getWrapper().set('content', '');
        editor.setComponents(code.trim());

        modal.close();
    };

    // Listen for CTRL + S
    container.onkeydown = function (e) {
        if (e.ctrlKey && e.code === 'KeyS') {
            const code = codeViewer.editor?.getValue();
            if (code) {
                console.log('Saving code editor content...')
                editor.DomComponents.getWrapper().set('content', '');
                editor.setComponents(code.trim());
                return false;
            }
        }
    };

    commands.add('html-edit', {
        run: (editor, sender) => {
            sender && sender.set('active', 0);
            modal.setTitle('Code Editor');

            let viewer = codeViewer.editor;
            if (!viewer) {
                const text = document.createElement('textarea');
                container.appendChild(text);
                container.appendChild(saveBtn);
                codeViewer.init(text);
                viewer = codeViewer.editor;
            }

            const InnerHtml = editor.getHtml();
            const Css = editor.getCss();
            modal.setContent('');
            modal.setContent(container);
            codeViewer.setContent(InnerHtml + "<style>" + Css + '</style>');

            modal.open();
            viewer.refresh();


            console.log(modal)
        }
    });

    editor.Panels.addButton('options', [{
            id: 'edit',
            className: 'fa fa-edit',
            command: 'html-edit',
            attributes: {
                title: 'Edit Code'
            }
        }]
    )
}