import { Page } from "./Page"
import React, { useEffect, useState } from "react"
import useRequest from "../../hooks/useRequest"
import { listTemplates } from "../../services/pageService"
import useResponseState from "../../hooks/useResponseState"
import { Button, ButtonProps, Dialog, DialogContent, Grid, LinearProgress } from "@mui/material"
import CloseButton from "../common/button/CloseButton"
import { backendURL } from "../../config/axios"
import RetryButton from "../common/button/RetryButton"
import PreviewPage from "./PreviewPage"
import { usePageStyles } from "./PagesPage"
import PageCard from "./PageCard"

type TemplatePage = Page & { uploads: any[] }

interface TemplateSelectorDialogProps {
  open: boolean
  onClose: () => any
  onSelect: (page: TemplatePage) => any
}

export function TemplateSelectorDialog({ open, onClose, onSelect }: TemplateSelectorDialogProps) {

  const classes = usePageStyles()

  const [previewPage, setPreviewPage] = useState<TemplatePage | undefined>()

  const { error, loading, response, execute: loadTemplates } = useRequest(listTemplates, {
    performInitially: false,
    errorMessage: 'Failed to load template pages'
  })
  useEffect(loadTemplates, [open])
  const [templates] = useResponseState<TemplatePage[]>(
    response,
    [],
    res => res.data?.templates?.map((template: any) => new Page({ ...template.page, uploads: template.uploads })) || []
  )

  const selectTemplate = (page: TemplatePage) => {
    console.log(page)
    onSelect(page)
    setPreviewPage(undefined)
  }

  // @ts-ignore
  const blankPage: TemplatePage = new Page({
    _id: 'blank_page',
    name: 'Blank Page',
    description: 'Start from scratch with a blank page.',
    uploads: []
  })

  const TemplateActions = (page: TemplatePage) => (
    <>
      <Button
        className={classes.actionButton}
        disabled={page._id?.length !== 24}
        color="primary"
        variant="contained"
        onClick={() => setPreviewPage(page)}
      >Preview Template</Button>
      <SelectTemplateButton onClick={() => selectTemplate(page)}/>
    </>
  )

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className={classes.templateDialog}>
      <div className={classes.templateList}>
        <>
          {loading && <LinearProgress/>}
          <CloseButton onClick={onClose}/>
          <DialogContent>
            <Grid container direction="row" alignItems="center">
              {[...templates, blankPage].filter(page => !page.isDiscarded()).map(page => (
                <Grid item xs={12} sm={6} key={page._id}>
                  <PageCard
                    displayStage={false}
                    page={page}
                    image={`${backendURL}/page/${page._id}/thumbnail`}
                    actions={TemplateActions(page)}
                  />
                </Grid>
              ))}
              <RetryButton error={error}/>
            </Grid>
            <PreviewPage
              page={previewPage}
              onClose={() => setPreviewPage(undefined)}
              actions={(
                <SelectTemplateButton onClick={() => selectTemplate(previewPage!!)}/>
              )}
            />
          </DialogContent>
        </>
      </div>
    </Dialog>
  )
}

function SelectTemplateButton(props: ButtonProps) {

  const classes = usePageStyles()

  return (
    <Button
      className={classes.actionButton}
      color="primary"
      variant="contained"
      {...props}
    >Select this template</Button>
  )
}
