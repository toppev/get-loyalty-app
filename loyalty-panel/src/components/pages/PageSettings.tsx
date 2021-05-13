import { Box, Button, Paper, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import StageSelector from "./StageSelector"
import { Page, PUBLISHED } from "./Page"
import { getPageScript, updatePage, uploadPageStaticFile } from "../../services/pageService"
import PageIcon from "./PageIcon"
import IconSelector from "./grapes/IconSelector"
import React, { useState, Suspense } from "react"
import { usePageStyles } from "./PagesPage"
import { RequestHandler } from "../../hooks/useRequest"

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
    uploadPageStaticFile(pageOpen._id, 'main.js', new Blob([content], { type: 'text/plain' }))
      .then(() => console.log('Uploaded the script!'))
  }

  return (
    <Box className={""} display="flex" flexDirection={smallScreen ? "column" : "row"}>
      <Paper className={classes.card}>
        <div className={classes.settingsCardDiv}>
          <div>
            <StageSelector
              stage={pageOpen.stage}
              onChange={(value) => {
                if (value !== PUBLISHED || window.confirm(`Confirm publishing "${pageOpen.name}". Anyone can see this page.`)) {
                  requests.performRequest(
                    () => {
                      pageOpen.stage = value
                      return updatePage(pageOpen, false)
                    }
                  )
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
              requests.performRequest(
                () => {
                  pageOpen.icon = icon
                  return updatePage(pageOpen, false)
                }
              )
            }}/>
          <p className={classes.info}>Icons are used in the site navigation bar</p>
        </div>
      </Paper>
      <Paper className={classes.card}>
        <div className={`${classes.settingsCardDiv} ${classes.center}`}>
          <Typography className={classes.iconTitle} variant="h6">Pathname</Typography>
          <PathnameField
            value={pageOpen.pathname}
            onSubmit={(pathname) => {
              requests.performRequest(
                () => {
                  pageOpen.pathname = pathname
                  return updatePage(pageOpen, false)
                }
              )
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
            onChange={(_editor, _data, content) => Math.random() > 0.9 && uploadScript(content)}
            onClose={(content) => {
              setCodeMirrorContent(undefined)
              uploadScript(content)
            }}
          />
        </Suspense>}
      </Paper>
    </Box>
  )
}

interface PathnameFieldProps {
  onSubmit: (pathname: string) => any
  value: string
}

function PathnameField({ onSubmit, value }: PathnameFieldProps) {

  if (!value.startsWith('/')) {
    value = `/${value}`
  }

  const classes = usePageStyles()

  return (
    <div className={classes.pathnameDiv}>
      <TextField
        className={classes.pathnameField}
        name="pathname"
        label="URL pathname of this page"
        placeholder="e.g /home or /rewards"
        value={value}
        onChange={(e) => onSubmit(e.target.value)}
      />
    </div>
  )
}
