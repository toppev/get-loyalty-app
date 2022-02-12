import { Button, ButtonProps } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import React, { Suspense, useCallback } from "react"
import { getPageStaticFileOrTemplate, STATIC_FILE_TEMPLATE_URL, uploadPageStaticFile } from "../../services/pageService"
import { usePageStyles } from "./PagesPage"
import { debounce } from "lodash"

const CodeMirror = React.lazy(() => import("./codemirror/CodeMirror"))

interface EditFileButtonProps extends ButtonProps {
  pageId: any
  fileName: string
  openEditor: (content: string) => any
  templateName?: string
}

export function EditFileButton({ pageId, fileName, openEditor, templateName, ...props }: EditFileButtonProps) {

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      endIcon={<EditIcon/>}
      style={{
        fontSize: '16px',
        padding: '0px 20px',
        textTransform: 'none'
      }}
      onClick={() => {
        getPageStaticFileOrTemplate(pageId, fileName, templateName)
          .then(content => {
            openEditor(content)
          })
          .catch(err => {
            console.log(err)
          })
      }}
      {...props}
    >{fileName}</Button>
  )
}

interface FileEditorProps {
  pageId: any
  fileName: string
  templateName?: string
  fileContent?: string
  onClose: () => any
}


export function FileEditor({ pageId, fileName, templateName, fileContent, onClose }: FileEditorProps) {

  const classes = usePageStyles()

  const uploadContent = (content: string) => uploadPageStaticFile(pageId, fileName, new Blob([content], { type: 'text/plain' }))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceUpload = useCallback(debounce((content: string) => {
    uploadContent(content)
  }, 2000, { leading: true }), [uploadContent])

  return (
    <>
      {fileContent !== undefined &&
      <Suspense fallback={<div className={classes.loading}>Loading...</div>}>
        <CodeMirror
          open
          initialValue={fileContent}
          codeMode={fileName.endsWith(".css") ? "css" : "javascript"}
          defaultValueURL={STATIC_FILE_TEMPLATE_URL + (templateName || "invalid_template")}
          onChange={(_editor, _data, content) => debounceUpload(content)}
          saveContent={async (content) => {
            return [200, 201].includes((await uploadContent(content)).status)
          }}
          onClose={() => {
            onClose()
          }}
        />
      </Suspense>}
    </>
  )
}
