import React, { useState } from "react"
import GrapesPageEditor from "./GrapesPageEditor"
import { Dialog, DialogContent, Link, Theme, Typography, useMediaQuery, useTheme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Button from "@mui/material/Button"
import { Page } from "../Page"
import { SelectPlaceholderCallback } from "./blocks/placeholderBlock"
import PlaceholderSelector from "./PlaceholderSelector"
import CloseButton from "../../common/button/CloseButton"
import Alert from '@mui/material/Alert'
import Tip from "../../common/Tip"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    enableEditor: {
      textAlign: 'center',
      color: 'gray'
    },
    enableEditorBtn: {
      color: 'lightblue',
      textTransform: 'lowercase'
    },
    savedMessage: {
      color: theme.palette.success.main,
      fontSize: '14px'
    },
    savedText: {
      color: theme.palette.grey[600]
    },
    saveChangesDiv: {
      height: '15px',
      margin: '7px 0px'
    },
    error: {
      margin: '7px 0px'
    },
    notEditable: {
      color: theme.palette.error.main,
      fontSize: '14px',
      marginTop: '20px',
      textAlign: 'center'
    }
  }))

interface PageEditorProps {
  page: Page
}

export default function ({ page }: PageEditorProps) {

  const classes = useStyles()

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  const [error, setError] = useState<string | undefined>()
  const [forceMobileEditor, setForceMobileEditor] = useState(false)

  // I don't know but don't touch this
  const [selectPlaceholderCallback, setSelectPlaceholderCallback] = useState<(str?: string) => any>()
  const selectPlaceholder = (callback: SelectPlaceholderCallback) => {
    // the surrounding function needed or otherwise it will call the callback??
    setSelectPlaceholderCallback(() => ((val: string) => callback(val)))
  }

  return !notMobile && !forceMobileEditor ? (
    <div>
      <Typography variant="h6" align="center" color="error">
        Unfortunately, the page editor may not work on mobile devices.
      </Typography>
      <div className={classes.enableEditor}>
        If you want to try it anyway,
        <Button
          size="small"
          className={classes.enableEditorBtn}
          onClick={() => setForceMobileEditor(true)}
        >tap here</Button>
      </div>
    </div>
  ) : (
    <div>
      <Tip>Open <Link href="/demo" target="_blank" rel="noopener noreferrer">demo page</Link> in another tab/window to see
        changes.</Tip>
      <div className={classes.saveChangesDiv}>
        <span className={classes.savedText}>Changes are automatically saved</span>
      </div>
      {error && <Alert className={classes.error} severity="error">{error}</Alert>}

      {page?.externalPage?.url ?
        <p className={classes.notEditable}>Can not edit content of pages with external URL</p>
        :
        <GrapesPageEditor
          page={page}
          _id={page._id}
          selectPlaceholder={selectPlaceholder}
          setError={(err: string) => setError(err)}
        />
      }
      <Dialog fullWidth open={!!selectPlaceholderCallback}>
        <CloseButton onClick={() => {
          if (selectPlaceholderCallback) {
            selectPlaceholderCallback(undefined)
            setSelectPlaceholderCallback(undefined)
          }
        }}/>
        <DialogContent>
          <PlaceholderSelector
            onSelect={(str) => {
              if (selectPlaceholderCallback) {
                selectPlaceholderCallback(str)
                setSelectPlaceholderCallback(undefined)
              }
            }}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}
