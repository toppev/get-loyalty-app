import { createStyles, Dialog, DialogContent, Link, makeStyles } from "@material-ui/core"
import React from "react"
import CloseButton from "../common/button/CloseButton"
import { Page } from "./Page"
import PreviewIframe from "../common/PreviewIframe"
import { DEMO_URL } from "../../config/axios"

const useStyles = makeStyles(theme =>
  createStyles({
    previewDialogContent: {
      textAlign: 'center',
    },
    explanation: {
      color: theme.palette.grey[700]
    }
  }))


interface PreviewPageProps {
  page: Page | undefined
  onClose: () => any
  open?: boolean
  actions?: JSX.Element
}

export default function PreviewPage({ page, onClose, actions, open = true }: PreviewPageProps) {

  const classes = useStyles()

  return !page ? null : (
    <Dialog onClose={onClose} open={open} maxWidth="sm">
      <CloseButton onClick={onClose}/>
      <DialogContent className={classes.previewDialogContent}>
        <h2>Previewing "{page.name}"</h2>
        <p>Performing actions (such as clicking buttons) may not work properly in previews.</p>
        <PreviewIframe src={`${DEMO_URL}/api/page/${page._id}/html`}/>
        <p className={classes.explanation}>
          The page has placeholders (the {"{{ stuff }}"} things). They are replaced with dynamic content such as your business
          information or the customer rewards. The preview has placeholders replaced with information of the
          <Link target="_blank" rel="noopener" href={DEMO_URL}> demo </Link>business.
        </p>
        {actions}
      </DialogContent>
    </Dialog>
  )
}
