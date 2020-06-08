import {
    Box,
    Button,
    ButtonProps,
    Card,
    CardActions,
    CardContent,
    CardMedia,
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
import { BASE_URL, getBusinessUrl, post } from '../../config/axios';
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardsDiv: {},
        card: {
            textAlign: 'center',
            margin: '15px',
            width: '350px',
        },
        actionCardsDivider: {
            margin: '12px 0px',
            backgroundColor: theme.palette.grey[800]
        },
        cardMedia: {},
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
            borderTop: 'solid 6px orange'
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
            color: "#2ae330",
        },
        settingPaper: {
            width: 'fit-content',
            margin: '15px'
        },
        settingDiv: {
            padding: '15px',
        },
        divider: {
            backgroundColor: theme.palette.grey[700]
        },
        templateDialog: {},
        pageCard: {
            margin: '15px',
        },
        center: {
            textAlign: 'center'
        },
        stageSelectorTypography: {
            fontSize: '16px',
            paddingTop: '18px'
        },
    }));

export default function () {

    const classes = useStyles();
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

    const { business } = useContext(AppContext)

    const [pageOpen, setPageOpen] = useState<Page | null>(null);
    const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

    const { error: listError, loading: listLoading, response, execute: fetchPages } = useRequest(listPages);
    const [pages, setPages] = useResponseState<Page[]>(response, [], res => res.data.map((it: any) => new Page(it)));

    const otherRequests = useRequest();
    const error = listError || otherRequests.error;
    const loading = listLoading || otherRequests.loading;

    return error ? (<RetryButton error={error}/>) : (
        <div>
            <div className={classes.cardsDiv}>
                <div>
                    <PageCard
                        className={`${classes.card} ${classes.templateSelectorCard}`}
                        page={new Page({ _id: '123', name: 'Create a new page' })}
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
                </div>
                <Divider className={classes.actionCardsDivider}/>
                {loading && <LinearProgress/>}
                <Box display="flex">
                    {pages.filter((page: Page) => !page.isDiscarded()).map((page: Page) => (
                        <PageCard
                            key={page._id}
                            className={classes.pageCard}
                            editableName
                            page={page}
                            image={`${BASE_URL}/business/${business._id}/page/${page._id}/thumbnail`}
                            actions={(
                                <>
                                    <Button
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
                    <Paper className={classes.settingPaper}>
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
                                                },
                                                () => {
                                                    setPageOpen(null);
                                                    fetchPages();
                                                }
                                            )
                                            return true;
                                        }
                                        return false;
                                    }}/>
                            </div>
                            <Typography
                                className={classes.stageSelectorTypography}
                                variant="subtitle1"
                                color={pageOpen.stage === PUBLISHED ? "secondary" : "primary"}
                            >Published sites are visible to anyone vising the site</Typography>
                        </div>
                    </Paper>
                    <Paper className={classes.settingPaper}>
                        <div className={`${classes.settingDiv} ${classes.center}`}>
                            <Typography variant="h6">Icon</Typography>
                            <p dangerouslySetInnerHTML={{ __html: pageOpen.icon }}/>
                            <p>Select a new icon for this page</p>
                            <IconSelector onSubmit={(icon) => {
                                otherRequests.performRequest(
                                    () => {
                                        pageOpen.icon = icon;
                                        return updatePage(pageOpen, false)
                                    },
                                    () => {
                                        setPageOpen(null);
                                        fetchPages();
                                    }
                                )
                            }}/>
                        </div>
                    </Paper>
                </Box>
                <PageEditor page={pageOpen}/>
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

    const { editableName, page, actions, displayId = true, displayStage = true, image, ...otherProps } = props;

    const classes = useStyles();

    const [editing, setEditing] = useState(false)

    const submitNameChange = () => {
        setEditing(false)
        const url = `${getBusinessUrl()}/page/${page._id}`;
        post(url, { name: page.name })
            .catch(err => {
                // Show notification?
                console.log(`Failed to rename page: ${err}`)
            })
    }

    return (
        <Card className={classes.card} {...otherProps}>
            {image && <CardMedia className={classes.cardMedia} image={image}/>}
            <CardContent>
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
                {page.description}
            </CardContent>
            <CardActions className={classes.cardActions}>
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
                {error ? (
                    <RetryButton error={error}/>
                ) : (
                    <>
                        {loading && <LinearProgress/>}
                        <CloseButton onClick={onClose}/>
                        <DialogContent>
                            <Grid container direction="row" alignItems="center">
                                {templates.filter(page => !page.isDiscarded()).map((page: Page) => (
                                    <Grid item xs={12} sm={6} key={page._id}>
                                        <PageCard
                                            displayStage={false}
                                            page={page}
                                            image={`${BASE_URL}/business/${appContext.business._id}/page/${page._id}/thumbnail`}
                                            actions={TemplateActions(page)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>
                        <PreviewPage
                            page={previewPage}
                            onClose={() => setPreviewPage(undefined)}
                            actions={(<SelectTemplateButton onClick={() => onSelect(previewPage!!)}/>)}
                        />
                    </>
                )}
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