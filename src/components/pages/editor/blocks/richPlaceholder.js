import React from "react";
import { placeholders } from "../Placeholders";

function addRichTextEditorPlaceholders(editor, context) {
    editor.RichTextEditor.add('loyally-placeholders', {
        icon: `<select class="gjs-field" style="color: lightgray; background-color: #343434">
            <option style="color: lightgrey" value="">Add Placeholder</option>
            ${listPlaceholderOptions(context).join('')}
        </select>`,
        // Bind the 'result' on 'change' listener
        event: 'change',
        result: (rte, action) => rte.insertHTML(action.btn.firstChild.value),
        // Reset the select on change
        update: (rte, action) => {
            action.btn.firstChild.value = "";
        }
    })
}

function listPlaceholderOptions(context) {
    const result = [];
    Object.entries(placeholders).map(([key, value]) => {
        Object.entries(value.placeholders).map(([property, placeholder]) => {
            const text = `{{${value.identifier}.${property}}}`;
            //  if (!placeholder.available || placeholder.available(context)) {
            result.push(`<option style="color: #bab8b8" value="${text}">${placeholder.name}</option>`)
            //}
        })
    })
    return result;
}

export {
    addRichTextEditorPlaceholders
}