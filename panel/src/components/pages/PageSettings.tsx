import { Box, Paper, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import StageSelector from "./StageSelector"
import { Page, PUBLISHED } from "./Page"
import { updatePage } from "../../services/pageService"
import PageIcon from "./PageIcon"
import IconSelector from "./grapes/IconSelector"
import React, { useState } from "react"
import { usePageStyles } from "./PagesPage"
import { RequestHandler } from "../../hooks/useRequest"
import { debounce } from "lodash"
import { EditFileButton, FileEditor } from "./FileEditor"


interface PageSettingsProps {
  pageOpen: Page
  requests: RequestHandler
}

export default function ({ pageOpen, requests }: PageSettingsProps) {

  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = usePageStyles()

  const [fileContent, setFileContent] = useState<string | undefined>()

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
          <p className={classes.info}>Published pages are visible to anyone vising the site</p>
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
            <EditFileButton
              fileName="main.js"
              pageId={pageOpen._id}
              openEditor={setFileContent}
            />
          </div>
        </div>
        <FileEditor
          fileName="main.js"
          pageId={pageOpen._id}
          fileContent={fileContent}
          onClose={() => setFileContent(undefined)}
        />
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
