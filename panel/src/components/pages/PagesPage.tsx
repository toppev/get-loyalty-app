import { Box, Button, Divider, IconButton, LinearProgress, Theme } from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import EditIcon from '@mui/icons-material/Edit'
import WebIcon from '@mui/icons-material/Web'
import React, { Suspense, useState } from 'react'
import { backendURL } from '../../config/axios'
import RetryButton from '../common/button/RetryButton'
import { Page } from './Page'
import useRequest from "../../hooks/useRequest"
import useResponseState from "../../hooks/useResponseState"
import { createPage, deletePage, listPages, updatePage } from "../../services/pageService"
import URLSelectorDialog from "./URLSelectorDialog"
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import PageSettings from './PageSettings'
import { EditFileButton, FileEditor } from "./FileEditor"
import PageCard from './PageCard'
import { TemplateSelectorDialog } from "./TemplateSelector"

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
    activeCard: {},
    inactiveCard: {
      backgroundColor: '#dcdcdc'
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

export default function PagesPage() {

  const classes = usePageStyles()

  // TODO: needs refactoring

  const [pageOpen, setPageOpen] = useState<Page | null>(null)
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false)
  const [urlSelectorOpen, setUrlSelectorOpen] = useState(false)

  const [editingFile, setEditingFile] = useState<{ content: string, fileName: string, templateName: string } | undefined>()

  const { error: listError, loading: listLoading, response } = useRequest(listPages)
  const [pages, setPages] = useResponseState<Page[]>(response, [], res => res.data.map((it: any) => new Page(it)))

  const sortedPages = [...pages].sort(((a, b) => {
    return (a.pageIndex || 0) - (b.pageIndex || 0)
  }))

  const otherRequests = useRequest()
  const error = listError || otherRequests.error
  const loading = listLoading // Showing load on otherRequests looks annoying

  const movePage = async (page: Page, direction: "right" | "left") => {
    const modifier = direction === "right" ? 1 : -1
    const other = sortedPages[sortedPages.indexOf(page) + modifier]
    let newSlot = other.pageIndex
    if (newSlot === page.pageIndex) {
      newSlot += modifier
    }
    other.pageIndex = page.pageIndex
    page.pageIndex = newSlot
    await updatePage(page, false)
    await updatePage(other, false)
    // Bad workaround to force a update
    setPages([...pages])
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
            onSelect={page => {
              if (pages.some(it => it.name === page.name && !it.isDiscarded())) {
                if (!window.confirm(`You already have page "${page.name}". Are you sure you want to add another?`)) {
                  return
                }
              }

              // A temp fix to ensure unique pathname
              if (pages.some(it => it.pathname === page.pathname)) {
                page.pathname = page.pathname + pages.length
              }

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
                () => createPage(new Page({ name: 'New page', id: 'new_page', externalPage: url })),
                (res) => {
                  setUrlSelectorOpen(false)
                  setPages([...pages, new Page(res.data)])
                }
              )
            }}
          />
          <PageCard
            className={`${classes.card} ${classes.center} ${classes.templateSelectorCard}`}
            page={new Page({
              _id: '3',
              name: 'Common Static Files',
              description: 'These files are loaded on every page immediately. This is a good place for common styling and customization.'
            })}
            displayId={false}
            displayStage={false}
            actions={(
              <>
                <EditFileButton
                  fileName="main.js"
                  templateName="common_main.js"
                  pageId="common"
                  openEditor={content => setEditingFile({ content, fileName: "main.js", templateName: "common_main.js" })}
                />
                <EditFileButton
                  fileName="main.css"
                  templateName="common_main.css"
                  pageId="common"
                  openEditor={content => setEditingFile({ content, fileName: "main.css", templateName: "common_main.css" })}
                />
              </>
            )}
          />
        </Box>
        <Divider className={classes.actionCardsDivider}/>

        {loading && <LinearProgress/>}

        <Box display="flex" flexWrap="wrap">
          {sortedPages.filter(page => !page.isDiscarded()).map(page => {
            const isActive = pageOpen?._id === page._id
            return (
              <PageCard
                key={page._id}
                className={classes.pageCard + ' ' + (isActive ? classes.activeCard : pageOpen && classes.inactiveCard)}
                editableName
                page={page}
                image={`${backendURL}/page/${page._id}/thumbnail`}
                actions={(
                  <>
                    <IconButton
                      className="show-on-hover"
                      disabled={page === sortedPages[0]}
                      onClick={() => movePage(page, "left")}
                      size="large"><KeyboardArrowLeftIcon/></IconButton>
                    <Button
                      disabled={isActive}
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
                      size="large">
                      <KeyboardArrowRightIcon/>
                    </IconButton>
                  </>
                )}
              />
            )
          })}
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

      <FileEditor
        fileName={editingFile?.fileName || ""}
        templateName={editingFile?.templateName}
        pageId="common"
        fileContent={editingFile?.content}
        onClose={() => setEditingFile(undefined)}
      />
    </div>
  )
}
