import React from "react";
import { placeholders } from "../Placeholders";
import { ellipsis } from "../../../common/StringUtils";

function addRichTextEditorPlaceholders(editor, context) {
    editor.RichTextEditor.add('loyalty-placeholders', {
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
    const { values } = context;
    const result = [];
    Object.entries(placeholders).map(([key, value]) => {
        Object.entries(value.placeholders).map(([property, placeholder]) => {
            const text = `{{${value.identifier}.${property}}}`;
            const subObj = values[value.identifier];
            const val = subObj && subObj[property];
            const currentValue = val ? `(${ellipsis(val, 12)})` : '*';
            if (!placeholder.available || placeholder.available(context)) {
                result.push(`<option style="color: #bab8b8" value="${text}">${placeholder.name} ${currentValue}</option>`)
            }
        })
    })
    result.push(`<option disabled value=""> * unknown value</option>`)
    return result;
}

export {
    addRichTextEditorPlaceholders
}