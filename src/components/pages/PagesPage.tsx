import {
    Button,
    ButtonProps,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    CardProps,
    createStyles,
    Dialog,
    DialogContent, Divider,
    Grid,
    IconButton,
    LinearProgress,
    makeStyles, Paper,
    TextField,
    Theme, Tooltip, Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import WebIcon from '@material-ui/icons/Web';
import React, { useContext, useState } from 'react';
import { BASE_URL, post } from '../../config/axios';
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            textAlign: 'center',
            margin: '15px',
        },
        cardMedia: {},
        cardActions: {
            display: 'block'
        },
        cardActionsDiv: {
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
        stageSelectorPaper: {
            width: 'fit-content',
            margin: '15px 0px'
        },
        stageSelectorDiv: {
            padding: '10px',
        },
        divider: {
            backgroundColor: theme.palette.grey[700]
        },
        templateDialog: {}
    }));

export default function () {

    const [pageOpen, setPageOpen] = useState<Page | null>(null);

    const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

    const { error: listError, loading: listLoading, response, execute: fetchPages } = useRequest(listPages);
    const [pages, setPages] = useState<Page[]>([new Page('123', 'test page', 'testiii')]);
    //const [pages, setPages] = useResponseState<Page[]>(response, []);

    const otherRequests = useRequest();

    const error = listError || otherRequests.error;
    const loading = listLoading || otherRequests.loading;

    const { business } = useContext(AppContext)
    const classes = useStyles();

    return error ? (<RetryButton error={error}/>) : (
        <div>
            {loading && <LinearProgress/>}
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={12} sm={4} key={"page_selector"}>
                    <PageCard
                        className={`${classes.card} ${classes.templateSelectorCard}`}
                        page={new Page('123', 'Create a new page')}
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
                                () => setTemplateSelectorOpen(false)
                            );
                        }}
                    />
                </Grid>
                {pages.filter((page: Page) => !page.isDiscarded()).map((page: Page) => (
                    <Grid item xs={12} sm={4} key={page._id}>
                        <PageCard
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
                                                otherRequests.performRequest(() => deletePage(page))
                                            }
                                        }}
                                    >Delete</Button>
                                </>
                            )}
                        />
                    </Grid>
                ))}
            </Grid>
            {pageOpen &&
            <>
                <Divider className={classes.divider}/>
                <Paper className={classes.stageSelectorPaper}>
                    <div className={classes.stageSelectorDiv}>
                        <div>
                            <StageSelector
                                initialStage={pageOpen.stage}
                                onChange={(value) => {
                                    if (value !== PUBLISHED || window.confirm(`Confirm publishing "${pageOpen.name}". Anyone can see this page.`)) {
                                        // FIXME: hacky
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
                            variant="subtitle1"
                            color={pageOpen.stage === PUBLISHED ? "secondary" : "primary"}
                        >Published sites are visible to anyone vising the site</Typography>
                    </div>
                </Paper>
                <PageEditor page={pageOpen}/>
            </>}
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
        const url = `${BASE_URL}/page/${page._id}`;
        post(url, { name: page.name })
            .catch(err => {
                // Show notification?
                console.log(`Failed to rename page: ${err}`)
            })
    }

    return (
        <Card className={classes.card} {...otherProps}>
            <CardActionArea>
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
                                            <Typography>{`Edit name`}</Typography>
                                            Change the name of the page
                                        </React.Fragment>
                                    }
                                >
                                    <IconButton
                                        className={classes.editPageNameBtn}
                                        onClick={() => editing ? submitNameChange() : setEditing(true)}
                                    >
                                        <EditIcon/>
                                    </IconButton>
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
            </CardActionArea>
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
    const [templates, setTemplates] = useResponseState<Page[]>(response, [])

    const TemplateActions = (page: Page) => (
        <>
            <Button
                className={classes.actionButton}
                color="primary"
                variant="contained"
                onClick={() => setPreviewPage(page)}
            >Preview Template</Button>
            <SelectTemplateButton onClick={() => onSelect(page)}/>
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