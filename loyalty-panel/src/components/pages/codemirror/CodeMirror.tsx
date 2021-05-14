import { Controlled as CodeMirror } from 'react-codemirror2'

import React, { useState } from "react"
import { Button, Dialog, DialogContent, makeStyles } from "@material-ui/core"
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
      padding: '15px',
      minHeight: '600px'
    }
  }))

interface CodeMirrorProps {
  open: boolean
  onClose: () => any
  onSave: (content: string) => any
  initialValue: string
  onChange: (editor: any, data: any, value: string) => any
}

export default function ({ open, onClose, initialValue, onChange, onSave }: CodeMirrorProps) {

  const classes = useStyles()

  const [content, setContent] = useState(initialValue)
  const [lastSavedContent, setLastSavedContent] = useState(initialValue)

  const isSaved = () => content === lastSavedContent

  window.onbeforeunload = !isSaved() ? () => true : null

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <CloseButton onClick={() => {
        if (isSaved() || window.confirm('Close without saving?')) {
          onClose()
        }
      }}/>
      <DialogContent className={classes.dialogContent}>
        <Button
          disabled={isSaved()}
          size="small"
          variant="contained"
          color="primary"
          style={{ marginBottom: '10px' }}
          onClick={() => {
            setLastSavedContent(content)
            onSave(content)
          }}
        >Save</Button>
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
