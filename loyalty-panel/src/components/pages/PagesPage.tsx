import {
  Box,
  Button,
  ButtonProps,
  Card,
  CardActions,
  CardContent,
  CardProps,
  createStyles,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  TextField,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import WebIcon from '@material-ui/icons/Web'
import React, { Suspense, useEffect, useState } from 'react'
import { backendURL, post } from '../../config/axios'
import CloseButton from '../common/button/CloseButton'
import IdText from '../common/IdText'
import RetryButton from '../common/button/RetryButton'
import { Page } from './Page'
import useRequest from "../../hooks/useRequest"
import useResponseState from "../../hooks/useResponseState"
import { createPage, deletePage, listPages, listTemplates, updatePage } from "../../services/pageService"
import PreviewPage from "./PreviewPage"
import URLSelectorDialog from "./URLSelectorDialog"
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import PageSettings from './PageSettings'

const PageEditor = React.lazy(() => import('./grapes/PageEditor'))

export const usePageStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardsDiv: {},
    card: {
      margin: '15px',
      width: '368px',
      minHeight: '200px',
    },
    actionCardsDivider: {
      backgroundColor: theme.palette.grey[800]
    },
    cardMedia: {
      height: '10%'
    },
    cardActions: {
      display: 'block',
      textAlign: 'center',
    },
    actionButton: {
      margin: '5px'
    },
    templateList: {
      minHeight: '300px',
      margin: '10px'
    },
    templateSelectorCard: {
      borderTop: 'solid 6px orange',
    },
    pageName: {
      fontSize: '22px',
      color: 'darkgray'
    },
    editPageNameBtn: {},
    pageNameField: {},
    unpublished: {
      color: theme.palette.grey[500],
    },
    published: {
      color: "#26a829",
    },
    settingsCardDiv: {
      textAlign: 'center',
      paddingTop: '20px',
      position: 'relative',
      height: '100%',
      width: '100%',
    },
    divider: {
      backgroundColor: theme.palette.grey[700]
    },
    templateDialog: {},
    pageCard: {
      margin: '15px',
      textAlign: 'center'
    },
    pageDesc: {
      color: theme.palette.grey[700],
      margin: '0px 5px'
    },
    center: {
      textAlign: 'center'
    },
    saveButton: {},
    pathnameDiv: {},
    pathnameField: {
      margin: '10px 0px'
    },
    iconTitle: {
      color: theme.palette.grey[600]
    },
    loading: {
      color: theme.palette.info.main,
      fontSize: '16px',
      textAlign: 'center'
    },
    info: {
      color: theme.palette.info.dark,
      fontSize: '12px',
      position: 'absolute',
      bottom: 5,
      marginLeft: 'auto',
      marginRight: 'auto',
      left: 0,
      right: 0,
      textAlign: 'center',
    },
    cardContentDiv: {
      position: 'relative'
    },
    cardContent: {
      position: 'relative',
      zIndex: 2
    },
    backgroundImage: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      '-webkit-mask-image': 'linear-gradient(to bottom, black 50%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
      position: 'absolute' as const,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      opacity: 0.6,
    }
  }))

export default function () {

  const classes = usePageStyles()

  const [pageOpen, setPageOpen] = useState<Page | null>(null)
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false)
  const [urlSelectorOpen, setUrlSelectorOpen] = useState(false)

  const { error: listError, loading: listLoading, response } = useRequest(listPages)
  const [pages, setPages] = useResponseState<Page[]>(response, [], res => res.data.map((it: any) => new Page(it)))

  const sortedPages = [...pages].sort(((a, b) => {
    return (a.pageIndex || 0) - (b.pageIndex || 0)
  }))

  const otherRequests = useRequest()
  const error = listError || otherRequests.error
  const loading = listLoading // Showing load on otherRequests looks annoying

  const movePage = (page: Page, direction: "right" | "left") => {
    const modifier = direction === "right" ? 1 : -1
    const other = sortedPages[sortedPages.indexOf(page) + modifier]
    let newSlot = other.pageIndex
    // FIXME
    // If the order is messed (same index), add +1/-1 to newSlot
    // It might skip 1 but whatever
    if (newSlot === page.pageIndex) {
      newSlot += modifier
    }
    other.pageIndex = page.pageIndex
    page.pageIndex = newSlot
    otherRequests.performRequest(() => updatePage(page, false))
    otherRequests.performRequest(() => updatePage(other, false))
  }

  return error ? (<RetryButton error={error}/>) : (
    <div>
      <div className={classes.cardsDiv}>
        <Box display="flex" flexWrap="wrap">
          <PageCard
            className={`${classes.card} ${classes.center} ${classes.templateSelectorCard}`}
            page={new Page({ _id: '1', name: 'Create a new page' })}
            displayId={false}
            displayStage={false}
            actions={(
              <Button
                className={classes.actionButton}
                color="primary"
                variant="contained"
                startIcon={(<WebIcon/>)}
                onClick={() => setTemplateSelectorOpen(true)}
              >Select a Template</Button>
            )}
          />
          <TemplateSelectorDialog
            open={templateSelectorOpen}
            onClose={() => setTemplateSelectorOpen(false)}
            onSelect={(page) => {
              // Create a new page using the same page
              // Basically just creates a "personal" clone (without description)
              page.description = ''
              page.template = false
              otherRequests.performRequest(
                () => createPage(page),
                (res) => {
                  setTemplateSelectorOpen(false)
                  setPages([...pages, new Page(res.data)])
                }
              )
            }}
          />

          <PageCard
            className={`${classes.card} ${classes.center} ${classes.templateSelectorCard}`}
            page={new Page({
              _id: '2',
              name: 'Use existing page',
              description: 'Create a new page from an existing website. ' +
                'For example, a form, homepage or a social media site. ' +
                "Note that all sites won't work."
            })}
            displayId={false}
            displayStage={false}
            actions={(
              <Button
                className={classes.actionButton}
                color="primary"
                variant="contained"
                startIcon={(<WebIcon/>)}
                onClick={() => setUrlSelectorOpen(true)}
              >Set URL</Button>
            )}
          />
          <URLSelectorDialog
            open={urlSelectorOpen}
            onClose={() => setUrlSelectorOpen(false)}
            onSubmit={url => {
              otherRequests.performRequest(
                () => createPage(new Page({ name: 'New page', id: 'new_page', externalURL: url })),
                (res) => {
                  setUrlSelectorOpen(false)
                  setPages([...pages, new Page(res.data)])
                }
              )
            }}
          />
        </Box>
        <Divider className={classes.actionCardsDivider}/>

        {loading && <LinearProgress/>}

        <Box display="flex" flexWrap="wrap">
          {sortedPages.filter(page => !page.isDiscarded()).map(page => (
            <PageCard
              key={page._id}
              className={classes.pageCard}
              editableName
              page={page}
              image={`${backendURL}/page/${page._id}/thumbnail`}
              actions={(
                <>
                  <IconButton
                    className="show-on-hover"
                    disabled={page === sortedPages[0]}
                    onClick={() => movePage(page, "left")}
                  ><KeyboardArrowLeftIcon/></IconButton>
                  <Button
                    disabled={pageOpen?._id === page._id}
                    className={classes.actionButton}
                    color="primary"
                    variant="contained"
                    startIcon={(<EditIcon/>)}
                    onClick={() => setPageOpen(page)}
                  >Edit</Button>
                  <Button
                    className={classes.actionButton}
                    color="secondary"
                    onClick={() => {
                      if (window.confirm(`Do you want to remove the page "${page.name}"?`)) {
                        // Not actually deleting them,
                        // instead make it invisible/(unavailable/discarded)
                        otherRequests.performRequest(
                          () => deletePage(page),
                          () => {
                            if (page._id === pageOpen?._id) {
                              setPageOpen(null)
                            }
                          }
                        )
                      }
                    }}
                  >Delete</Button>
                  <IconButton
                    className="show-on-hover"
                    disabled={page === sortedPages[sortedPages.length - 1]}
                    onClick={() => movePage(page, "right")}
                  >
                    <KeyboardArrowRightIcon/>
                  </IconButton>
                </>
              )}
            />
          ))}
        </Box>
      </div>

      {pageOpen &&
      <div>
        <Divider className={classes.divider}/>
        <PageSettings pageOpen={pageOpen} requests={otherRequests}/>
        <Suspense fallback={<div className={classes.loading}>Loading editor...</div>}>
          <PageEditor page={pageOpen}/>
        </Suspense>
      </div>}

    </div>
  )
}

interface PageCardProps extends CardProps {
  page: Page
  editableName?: boolean
  actions?: React.ReactNode
  displayId?: boolean
  displayStage?: boolean
  image?: string
}

function PageCard(props: PageCardProps) {

  const { editableName, page, actions, displayId = true, displayStage = true, image, ...otherProps } = props

  const classes = usePageStyles()

  const [editing, setEditing] = useState(false)

  const submitNameChange = () => {
    setEditing(false)
    const url = `${backendURL}/page/${page._id}`
    post(url, { name: page.name }, true)
      .catch(err => {
        // Show notification?
        console.log(`Failed to rename page: ${err}`)
      })
  }

  const backgroundImageCss = image ? {
    backgroundImage: `url(${image})`,
  } : {}

  return (
    <Card className={classes.card} {...otherProps}>
      <div className={classes.cardContentDiv}>
        <div className={classes.backgroundImage} style={backgroundImageCss}/>
        <CardContent className={`${classes.cardContent} ${classes.center}`}>
          <TextField
            disabled={!editing}
            className={classes.pageNameField}
            defaultValue={page.name}
            margin="dense"
            name="name"
            type="text"
            inputProps={{ min: 0, style: { textAlign: 'center', color: '#292929' } }}
            InputProps={{
              className: classes.pageName,
              disableUnderline: !editing,
              endAdornment: editableName ? (
                <Tooltip
                  enterDelay={750}
                  leaveDelay={100}
                  title={
                    <React.Fragment>
                      <Typography>{`Rename`}</Typography>
                      The name of the page is not shown to customers.
                    </React.Fragment>
                  }
                >
                  <div>
                    <IconButton
                      className={classes.editPageNameBtn}
                      onClick={() => editing ? submitNameChange() : setEditing(true)}
                    >
                      <EditIcon/>
                    </IconButton>
                  </div>
                </Tooltip>
              ) : null,
            }}
            onChange={(e) => page.name = e.target.value}
            onBlur={() => submitNameChange()}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault()
                submitNameChange()
              }
            }}
          />
          <br/>
          <span className={classes.pageDesc}>{page.description}</span>
        </CardContent>
      </div>
      <CardActions className={`${classes.cardActions} hoverable`}>
        {<p style={{ color: 'grey' }}>{page.template ? "Template page" : ""}</p>}
        {displayStage &&
        <Typography variant="h6">
          Stage:
          <span className={page.isPublished() ? classes.published : classes.unpublished}> {page.stage}</span>
        </Typography>}
        {actions}
        {displayId && <IdText id={page._id}/>}
      </CardActions>
    </Card>
  )
}

interface TemplateSelectorDialogProps {
  open: boolean
  onClose: () => any
  onSelect: (page: Page) => any
}

function TemplateSelectorDialog({ open, onClose, onSelect }: TemplateSelectorDialogProps) {

  const classes = usePageStyles()

  const [previewPage, setPreviewPage] = useState<Page | undefined>()

  const { error, loading, response, execute: loadTemplates } = useRequest(listTemplates, {
    performInitially: false,
    errorMessage: 'Failed to load template pages'
  })
  useEffect(loadTemplates, [open])
  const [templates] = useResponseState<Page[]>(response, [], res => res.data.map((d: any) => new Page(d)))

  const selectTemplate = (page: Page) => {
    console.log(page)
    onSelect(page)
    setPreviewPage(undefined)
  }

  const blankPage = new Page({
    _id: 'blank_page',
    name: 'Blank Page',
    description: 'Start from scratch with a blank page.'
  })

  const TemplateActions = (page: Page) => (
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
              {[...templates, blankPage].filter(page => !page.isDiscarded()).map((page: Page) => (
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
