import { Controlled as CodeMirror } from 'react-codemirror2'

import React, { useState } from "react"
import { Dialog, DialogContent, makeStyles } from "@material-ui/core"
import CloseButton from "../../common/button/CloseButton"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/material.css"
import "codemirror/mode/javascript/javascript"
import "codemirror/addon/hint/show-hint"
import "codemirror/addon/hint/javascript-hint"
import "codemirror/addon/hint/show-hint.css"
import "codemirror/keymap/sublime"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/fold/foldcode"
import "codemirror/addon/fold/foldgutter"
import "codemirror/addon/fold/brace-fold"
import "codemirror/addon/fold/comment-fold"
import "codemirror/addon/fold/foldgutter.css"
import './codeMirror.css'
import { createStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      padding: '35px',
      minHeight: '600px'
    }
  }))

interface CodeMirrorProps {
  open: boolean
  onClose: (content: string) => any
  initialValue: string
  onChange: (editor: any, data: any, value: string) => any
}

export default function ({ open, onClose, initialValue, onChange }: CodeMirrorProps) {

  const classes = useStyles()

  const [content, setContent] = useState(initialValue)

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <CloseButton onClick={() => onClose(content)}/>
      <DialogContent className={classes.dialogContent}>
        <CodeMirror
          value={content}
          options={{
            mode: 'javascript',
            theme: 'material',
            lineWrapping: true,
            smartIndent: true,
            lineNumbers: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            autoCloseTags: true,
            keyMap: "sublime",
            autoCloseBrackets: true,
            extraKeys: {
              "Ctrl-Space": "autocomplete"
            }
          }}
          onBeforeChange={(editor, data, value) => setContent(value)}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}
