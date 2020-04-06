import { Button, ButtonProps, Card, CardActionArea, CardActions, CardContent, CardMedia, CardProps, createStyles, Dialog, DialogContent, Grid, IconButton, LinearProgress, makeStyles, TextField, Theme } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import WebIcon from '@material-ui/icons/Web';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BASE_URL, get, post } from '../../config/axios';
import AppContext from '../../context/AppContext';
import CloseButton from '../common/CloseButton';
import IdText from '../common/IdText';
import RetryButton from '../common/RetryButton';
import Page from './Page';
import PageEditor from './PageEditor';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            textAlign: 'center',
            margin: '15px',
        },
        cardMedia: {

        },
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
            margin: '10px'
        },
        previewDialogContent: {
            textAlign: 'center',
            maxWidth: '410px'
        },
        templateSelectorCard: {
            borderTop: 'solid 6px orange'
        },
        pageName: {
            fontSize: '22px',
            color: 'darkgray'
        },
        editPageNameBtn: {
        },
        pageNameField: {

        }
    }));

export default function () {

    const [loading, setLoading] = useState(false);
    const [pageOpen, setPageOpen] = useState<Page | null>(null);
    const testpage = { _id: "d12jhd12hjd", name: "test page" };
    const testpage2 = { _id: "d12jawdadd12hjd", name: "test page" };
    const [pages, setPages] = useState<Page[]>([testpage, testpage2]);
    const [error, setError] = useState("");

    const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

    const classes = useStyles();

    const appContext = useContext(AppContext);

    const fetchData = useCallback(() => {
        setError("")
        setLoading(true);
        get(`/business/${appContext.business._id}/pages/list`)
            .then(res => {
                setPages(res.data);
            }).catch(err => {
                setError(err);
            }).finally(() => {
                setLoading(false);
            });

    }, [appContext.business._id])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (<div>
        {loading ? (
            <LinearProgress />
        ) : error && false && "TODO REMOVE THE FALSE" ? (
            <RetryButton error={error.toString()} callback={async () => fetchData()} />
        ) : (
                    <>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={4} key={"page_selector"}>
                                <PageCard
                                    className={`${classes.card} ${classes.templateSelectorCard}`}
                                    page={{
                                        name: 'Create a new page',
                                        _id: '',
                                    }}
                                    displayId={false}
                                    actions={(
                                        <Button
                                            className={classes.actionButton}
                                            color="primary"
                                            variant="contained"
                                            startIcon={(<WebIcon />)}
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
                                        post(`/business/${appContext.business._id}/pages/`, page)
                                            .then(res => {
                                                console.log(res.data) //TODO remove
                                                setPages([res.data, ...pages])
                                                setTemplateSelectorOpen(false);
                                                setPageOpen(res.data);
                                            }).catch(err => {
                                                // TODO
                                            });
                                    }}
                                />
                            </Grid>
                            {pages.filter(page => !page.invisible).map(page => (
                                <Grid item xs={12} sm={4} key={page._id}>
                                    <PageCard
                                        editableName
                                        page={page}
                                        image={`${BASE_URL}/business/${appContext.business._id}/page/${page._id}/thumbnail`}
                                        actions={(
                                            <>
                                                <Button
                                                    className={classes.actionButton}
                                                    color="primary"
                                                    variant="contained"
                                                    startIcon={(<EditIcon />)}
                                                    onClick={() => setPageOpen(page)}
                                                >Edit</Button>
                                                <Button
                                                    className={classes.actionButton}
                                                    color="secondary"
                                                    onClick={() => {
                                                        if (window.confirm('Do you want to delete the page?')) {
                                                            // Not actually deleting them, instead make it invisible (unavailable)
                                                            page.invisible = true;
                                                            // Even though it's a POST it works like a PATCH
                                                            post(`/page/${page._id}`, page)
                                                                .then(res => {
                                                                    // ignore for now
                                                                }).catch(err => {
                                                                    // ignore for now
                                                                });
                                                        }
                                                    }}
                                                >Delete</Button>
                                            </>
                                        )}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <div> {pageOpen && <PageEditor page={pageOpen} />} </div>
                    </>
                )}
    </div>);
}


interface PageCardProps extends CardProps {
    page: Page
    editableName?: boolean
    actions?: React.ReactNode
    displayId?: boolean
    image?: string
}

function PageCard(props: PageCardProps) {

    const { editableName, page, actions, displayId = true, image } = props;

    const classes = useStyles();

    const [editing, setEditing] = useState(false)

    const submitNameChange = () => {
        setEditing(false)
        const url = `${BASE_URL}/page$/${page._id}`;
        // TODO handle
        post(url, { name: page.name })
            .then(res => { })
            .catch(err => { })
    }

    return (
        <Card className={classes.card} {...props}>
            <CardActionArea>
                {image && <CardMedia className={classes.cardMedia} image={image} />}
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
                                <IconButton
                                    className={classes.editPageNameBtn}
                                    onClick={() => editing ? submitNameChange() : setEditing(true)}
                                >
                                    <EditIcon />
                                </IconButton>
                            ) : (null),
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
                {actions}
                {displayId && <IdText id={page._id} />}
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

    const testpage = { _id: "d12jhd12hjd", name: "test page" };
    const testpage2 = { _id: "d12jhdadöahd12hjd", name: "test page" };
    const testpage3 = { _id: "dawdawd12jhd12hjd", name: "test page" };

    const [previewPage, setPreviewPage] = useState<Page | undefined>();
    const [templates, setTemplates] = useState<Page[]>([testpage, testpage2, testpage3]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const classes = useStyles();

    const appContext = useContext(AppContext);

    const fetchData = useCallback(() => {
        setError("")
        setLoading(true);
        get(`/ business / ${appContext.business._id} /page/templates`)
            .then(res => {
                setTemplates(res.data);
            }).catch(err => {
                setError(err);
            }).finally(() => {
                setLoading(false);
            });
    }, [appContext.business._id])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const TemplateActions = (page: Page) => (
        <>
            <Button
                className={classes.actionButton}
                color="primary"
                variant="contained"
                onClick={() => setPreviewPage(page)}
            >Preview Template</Button>
            <SelectTemplateButton onClick={() => onSelect(page)} />
        </>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}> {loading ? (
            <LinearProgress />
        ) : error && false && "TODO REMOVE THE FALSE" ? (
            <RetryButton error={error.toString()} callback={async () => fetchData()} />
        ) : (
                    <div className={classes.templateList}>
                        <CloseButton onClick={onClose} />
                        <DialogContent>
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                            >
                                {templates.filter(page => !page.invisible).map(page => (
                                    <Grid item xs={12} sm={6} key={page._id}>
                                        <PageCard
                                            page={page}
                                            image={`${BASE_URL} /business/${appContext.business._id} /page/${page._id} /thumbnail`}
                                            actions={TemplateActions(page)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>

                        <PreviewPage
                            page={previewPage}
                            onClose={() => setPreviewPage(undefined)}
                            onSelect={page => onSelect(page)}
                        />
                    </div>
                )
        }
        </Dialog >
    );
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

interface PreviewPageProps {
    page: Page | undefined
    onClose: () => any
    onSelect: (page: Page) => any
    open?: boolean
}

function PreviewPage({ onSelect, page, onClose, open = true }: PreviewPageProps) {

    const classes = useStyles();

    const appContext = useContext(AppContext);

    return !!!page ? (
        null
    ) : (
            <Dialog onClose={onClose} open={open} maxWidth={false}>
                <CloseButton onClick={onClose} />
                <DialogContent className={classes.previewDialogContent}>
                    <iframe title="Page Preview" src={`${BASE_URL}/business/${appContext.business._id}/page/${page._id}/html`} height={640} width={360} />
                    <SelectTemplateButton onClick={() => onSelect(page)} />
                </DialogContent>
            </Dialog>
        )
}