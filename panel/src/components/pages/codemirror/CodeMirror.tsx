import { Controlled as CodeMirror } from 'react-codemirror2'

import React, { useState } from "react"
import { Button, Dialog, DialogContent, Link } from "@mui/material"
import makeStyles from '@mui/styles/makeStyles'
import CloseButton from "../../common/button/CloseButton"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/material.css"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/css/css"
import "codemirror/addon/hint/show-hint"
import "codemirror/addon/hint/javascript-hint"
import "codemirror/addon/hint/css-hint"
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
import { Theme } from "@mui/material/styles"

import createStyles from '@mui/styles/createStyles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      padding: '15px',
      minHeight: '600px',
    },
    dialogTools: {
      textAlign: 'end',
      margin: '0 25px'
    },
    toolItem: {
      margin: '0 15px 10px 0',
    }
  }))

interface CodeMirrorProps {
  initialValue: string
  defaultValueURL?: string
  open: boolean
  onClose: () => any
  onChange: (editor: any, data: any, value: string) => any
  saveContent: (content: string) => Promise<boolean>
  codeMode: "javascript" | "css"
}

export default function ({ open, onClose, initialValue, onChange, saveContent, defaultValueURL, codeMode }: CodeMirrorProps) {

  const classes = useStyles()

  const [content, setContent] = useState(initialValue)
  const [lastSavedContent, setLastSavedContent] = useState(initialValue)

  const isSaved = () => content === lastSavedContent

  const [saveButton, setSaveButton] = useState("Save")

  window.onbeforeunload = !isSaved() ? () => true : null

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <CloseButton onClick={() => {
        if (isSaved() || window.confirm('Close without saving?')) {
          onClose()
        }
      }}/>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.dialogTools}>
          {defaultValueURL &&
          <Link className={classes.toolItem} target="_blank" rel="noopener" href={defaultValueURL}>View default value</Link>}
          <Button
            disabled={isSaved()}
            size="small"
            variant="contained"
            color="primary"
            className={classes.toolItem}
            onClick={() => {
              setSaveButton("Saving...")
              setLastSavedContent(content)
              saveContent(content).then(it => {
                if (it) {
                  setSaveButton("Save")
                } else {
                  setSaveButton("Save failed!")
                  // Fake a change
                  setLastSavedContent("")
                }
              })
            }}
          >{saveButton}</Button>
        </div>
        <CodeMirror
          value={content}
          options={{
            mode: codeMode,
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
