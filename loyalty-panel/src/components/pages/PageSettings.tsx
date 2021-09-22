import { Box, Button, Paper, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import StageSelector from "./StageSelector"
import { Page, PUBLISHED } from "./Page"
import { DEFAULT_MAIN_JS_URL, getPageScript, updatePage, uploadPageStaticFile } from "../../services/pageService"
import PageIcon from "./PageIcon"
import IconSelector from "./grapes/IconSelector"
import React, { Suspense, useState } from "react"
import { usePageStyles } from "./PagesPage"
import { RequestHandler } from "../../hooks/useRequest"
import EditIcon from "@material-ui/icons/Edit"
import { debounce } from "lodash"

const CodeMirror = React.lazy(() => import("./codemirror/CodeMirror"))


interface PageSettingsProps {
  pageOpen: Page
  requests: RequestHandler
}

export default function ({ pageOpen, requests }: PageSettingsProps) {

  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = usePageStyles()

  const [codeMirrorContent, setCodeMirrorContent] = useState<string | undefined>()

  const uploadScript = (content: string) => {
    return uploadPageStaticFile(pageOpen._id, 'main.js', new Blob([content], { type: 'text/plain' }))
  }

  const sendPageUpdate = debounce(function () {
    requests.performRequest(
      () => {
        return updatePage(pageOpen, false)
      }
    )
  }, 500)

  return (
    <Box className={""} display="flex" flexDirection={smallScreen ? "column" : "row"}>
      <Paper className={classes.card}>
        <div className={classes.settingsCardDiv}>
          <div>
            <StageSelector
              stage={pageOpen.stage}
              onChange={(value) => {
                if (value !== PUBLISHED || window.confirm(`Confirm publishing "${pageOpen.name}". Anyone can see this page.`)) {
                  pageOpen.stage = value
                  sendPageUpdate()
                  return true
                }
                return false
              }}/>
          </div>
          <p className={classes.info}>Published sites are visible to anyone vising the site</p>
        </div>
      </Paper>
      <Paper className={classes.card}>
        <div className={`${classes.settingsCardDiv} ${classes.center}`}>
          <Typography className={classes.iconTitle} variant="h6">Icon</Typography>
          <PageIcon icon={pageOpen.icon}/>
          <IconSelector
            initialIcon={pageOpen.icon || pageOpen.pathname}
            onSubmit={(icon) => {
              pageOpen.icon = icon
              sendPageUpdate()
            }}/>
          <p className={classes.info}>Icons are used in the site navigation bar</p>
        </div>
      </Paper>
      <Paper className={classes.card}>
        <div className={`${classes.settingsCardDiv} ${classes.center}`}>
          <Typography className={classes.iconTitle} variant="h6">Pathname</Typography>
          <PathnameField
            defaultValue={`/${pageOpen.pathname}`}
            onSubmit={(pathname) => {
              pageOpen.pathname = pathname
              sendPageUpdate()
            }}
          />
        </div>
      </Paper>
      <Paper className={classes.card}>
        <div className={`${classes.settingsCardDiv} ${classes.center}`}>
          <Typography className={classes.iconTitle} variant="h6">Scripts</Typography>
          <div>
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
                getPageScript(pageOpen._id)
                  .then(content => {
                    setCodeMirrorContent(content)
                  })
                  .catch(err => {
                    console.log(err)
                    requests.error = err
                  })
              }}
            >main.js</Button>
          </div>
        </div>
        {codeMirrorContent !== undefined &&
        <Suspense fallback={<div className={classes.loading}>Loading...</div>}>
          <CodeMirror
            open
            initialValue={codeMirrorContent}
            defaultValueURL={DEFAULT_MAIN_JS_URL}
            onChange={(_editor, _data, content) => {
              Math.random() > 0.9 && uploadScript(content)
            }}
            saveContent={async (content) => [200, 201].includes((await uploadScript(content)).status)}
            onClose={() => setCodeMirrorContent(undefined)}
          />
        </Suspense>}
      </Paper>
    </Box>
  )
}

interface PathnameFieldProps {
  onSubmit: (pathname: string) => any
  defaultValue: string
}

function PathnameField({ onSubmit, defaultValue }: PathnameFieldProps) {

  const classes = usePageStyles()

  return (
    <div className={classes.pathnameDiv}>
      <TextField
        className={classes.pathnameField}
        name="pathname"
        label="URL pathname of this page"
        placeholder="e.g /home or /rewards"
        defaultValue={defaultValue}
        onChange={e => {
          const value = e.target.value
          onSubmit(value)
        }}
      />
    </div>
  )
}
