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
    Paper,
    TextField,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import WebIcon from '@material-ui/icons/Web';
import React, { useContext, useState } from 'react';
import { backendURL, post } from '../../config/axios';
import AppContext from '../../context/AppContext';
import CloseButton from '../common/button/CloseButton';
import IdText from '../common/IdText';
import RetryButton from '../common/button/RetryButton';
import { Page, PUBLISHED } from './Page';
import PageEditor from './editor/PageEditor';
import useRequest from "../../hooks/useRequest";
import useResponseState from "../../hooks/useResponseState";
import { createPage, deletePage, listPages, listTemplates, updatePage } from "../../services/pageService";
import StageSelector from "./StageSelector";
import PreviewPage from "./PreviewPage";
import IconSelector from "./editor/IconSelector";
import URLSelectorDialog from "./URLSelectorDialog";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import PageIcon from "./PageIcon";

const useStyles = makeStyles((theme: Theme) =>
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
        settingDiv: {
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
    }));

export default function () {

    const classes = useStyles();
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

    const { business } = useContext(AppContext)

    const [pageOpen, setPageOpen] = useState<Page | null>(null);
    const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
    const [urlSelectorOpen, setUrlSelectorOpen] = useState(false);

    const { error: listError, loading: listLoading, response, execute } = useRequest(listPages);
    const [pages, setPages] = useResponseState<Page[]>(response, [], res => res.data.map((it: any) => new Page(it)));

    const sortedPages = [...pages].sort(((a, b) => {
        return (a.pageIndex || 0) - (b.pageIndex || 0)
    }))

    const otherRequests = useRequest();
    const error = listError || otherRequests.error;
    const loading = listLoading || otherRequests.loading;

    const movePage = (page: Page, direction: "right" | "left") => {
        const modifier = direction === "right" ? 1 : -1;
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
                            // Basically just creates a "personal" clone
                            otherRequests.performRequest(
                                () => createPage(page),
                                (res) => {
                                    setTemplateSelectorOpen(false);
                                    setPages([...pages, new Page(res.data)])
                                }
                            );
                        }}
                    />

                    <PageCard
                        className={`${classes.card} ${classes.center} ${classes.templateSelectorCard}`}
                        page={new Page({
                            _id: '2',
                            name: 'Use existing page',
                            description: 'Create a new page using an existing website. E.g social media site, form or homepage.'
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
                                    setUrlSelectorOpen(false);
                                    setPages([...pages, new Page(res.data)])
                                }
                            );
                        }}
                    />
                </Box>
                <Divider className={classes.actionCardsDivider}/>
                {loading && <LinearProgress/>}
                <Box display="flex" flexWrap="wrap">
                    {sortedPages.filter((page: Page) => !page.isDiscarded()).map((page: Page) => (
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
                                                // Not actually deleting them, instead make it invisible (unavailable)
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
                <Box display="flex" flexDirection={bigScreen ? "row" : "column"}>
                    <Paper className={classes.card}>
                        <div className={classes.settingDiv}>
                            <div>
                                <StageSelector
                                    initialStage={pageOpen.stage}
                                    onChange={(value) => {
                                        if (value !== PUBLISHED || window.confirm(`Confirm publishing "${pageOpen.name}". Anyone can see this page.`)) {
                                            otherRequests.performRequest(
                                                () => {
                                                    pageOpen.stage = value;
                                                    return updatePage(pageOpen, false)
                                                }
                                            )
                                            return true;
                                        }
                                        return false;
                                    }}/>
                            </div>
                            <p className={classes.info}>Published sites are visible to anyone vising the site</p>
                        </div>
                    </Paper>
                    <Paper className={classes.card}>
                        <div className={`${classes.settingDiv} ${classes.center}`}>
                            <Typography className={classes.iconTitle} variant="h6">Icon</Typography>
                            <PageIcon icon={pageOpen.icon}/>
                            <IconSelector
                                initialIcon={pageOpen.icon}
                                onSubmit={(icon) => {
                                    otherRequests.performRequest(
                                        () => {
                                            pageOpen.icon = icon;
                                            return updatePage(pageOpen, false)
                                        }
                                    )
                                }}/>
                            <p className={classes.info}>Icons are used in the site navigation bar</p>
                        </div>
                    </Paper>
                    <Paper className={classes.card}>
                        <div className={`${classes.settingDiv} ${classes.center}`}>
                            <Typography className={classes.iconTitle} variant="h6">Pathname</Typography>
                            <PathnameField
                                initialValue={pageOpen.pathname}
                                onSubmit={(pathname) => {
                                    otherRequests.performRequest(
                                        () => {
                                            pageOpen.pathname = pathname;
                                            return updatePage(pageOpen, false)
                                        }
                                    )
                                }}
                            />
                        </div>
                    </Paper>
                </Box>
                <PageEditor page={pageOpen}/>
            </div>}
        </div>
    )
}

interface PathnameFieldProps {
    onSubmit: (pathname: string) => any
    initialValue: string
}

function PathnameField({ onSubmit, initialValue }: PathnameFieldProps) {

    if (!initialValue.startsWith('/')) {
        initialValue = `/${initialValue}`;
    }

    const classes = useStyles();

    return (
        <div className={classes.pathnameDiv}>
            <TextField
                className={classes.pathnameField}
                name="pathname"
                label="URL pathname of this page"
                placeholder="e.g /home or /rewards"
                defaultValue={initialValue}
                onChange={(e) => onSubmit(e.target.value)}
            />
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

    const { editableName, page, actions, displayId = true, displayStage = true, image, ...otherProps } = props;

    const classes = useStyles();

    const [editing, setEditing] = useState(false)

    const submitNameChange = () => {
        setEditing(false)
        const url = `${backendURL}/page/${page._id}`;
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
                <CardContent className={classes.cardContent}>
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
                                            This name is used in the url.
                                            Good names are simple. For example, "home", "products" or "campaigns"
                                        </React.Fragment>
                                    }
                                >
                                    <div>
                                        <IconButton className={classes.editPageNameBtn}
                                                    onClick={() => editing ? submitNameChange() : setEditing(true)}>
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
                                ev.preventDefault();
                                submitNameChange();
                            }
                        }}
                    />
                    <br/>
                    <span className={classes.pageDesc}>{page.description}</span>
                </CardContent>
            </div>
            <CardActions className={`${classes.cardActions} hoverable`}>
                {displayStage &&
                <Typography variant="h6">
                    Stage: <span
                    className={page.isPublished() ? classes.published : classes.unpublished}>{page.stage}</span>
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

    const classes = useStyles();
    const appContext = useContext(AppContext);

    const [previewPage, setPreviewPage] = useState<Page | undefined>();
    const { error, loading, response } = useRequest(listTemplates, { performInitially: true });
    const [templates, setTemplates] = useResponseState<Page[]>(response, [], res => res.data.map((d: any) => new Page(d)))

    const blankPage = new Page({
        id: 'blank_page',
        name: 'Blank Page',
        description: 'Start from scratch with a blank page.'
    })

    const TemplateActions = (page: Page) => (
        <>
            <Button
                className={classes.actionButton}
                color="primary"
                variant="contained"
                onClick={() => setPreviewPage(page)}
            >Preview Template</Button>
            <SelectTemplateButton onClick={() => {
                onSelect(page);
                setPreviewPage(undefined);
            }}/>
        </>
    );

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
                            {error && <RetryButton error={error}/>}
                        </Grid>
                    </DialogContent>
                    <PreviewPage
                        page={previewPage}
                        onClose={() => setPreviewPage(undefined)}
                        actions={(<SelectTemplateButton onClick={() => onSelect(previewPage!!)}/>)}
                    />
                </>
            </div>
        </Dialog>
    )
}

function SelectTemplateButton(props: ButtonProps) {

    const classes = useStyles();

    return (
        <Button
            className={classes.actionButton}
            color="primary"
            variant="contained"
            {...props}
        >Select this template</Button>
    )
}