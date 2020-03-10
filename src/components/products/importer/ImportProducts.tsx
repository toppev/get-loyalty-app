import { Button, ButtonProps, createStyles, Dialog, DialogContent, DialogContentText, IconButton, LinearProgress, makeStyles, Theme, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { ReactElement, useState } from 'react';
import { post, uploadFile } from '../../../config/axios';
import Product from '../Product';
import ProductContext from '../ProductContext';
import { useProductOperations } from '../ProductHook';
import ProductRow from '../ProductRow';
import ColumnMapping, { KeyValue } from './ColumnMapping';
import ProductsDropzone from './ImportDropzone';

const URL_PREFIX = 'http://localhost:8080'

let fileId: string | null = null;

const readableColumnOptions = ['Product Name', 'Product Description', 'Product Price', 'None (exclude column)'];

interface Props extends ButtonProps {

}

interface ColumnResponse {
    fileId: string,
    extension: string,
    columns: KeyValue
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
        content: {
            marginTop: '35px',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
        submitDiv: {
            textAlign: 'center',
        },
        submitButton: {
            margin: '20px 10px 10px 10px'
        },
        center: {
            textAlign: 'center',
        }
    }));


export default function ImportProducts(props: Props): ReactElement {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [error, setError] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [submittingFile, setSubmittingFile] = useState(false);
    const [mappingFields, setMappingFields] = useState<KeyValue>({});

    const previewProducts = useProductOperations()

    const classes = useStyles();

    const toggleDialogOpen = () => {
        setDialogOpen(!dialogOpen);
        setError('')
    }

    const togglePreviewOpen = () => {
        setPreviewOpen(!previewOpen);
    }

    const discardAll = () => {
        setMappingFields({})
        resetImport()
    }

    const resetImport = () => {
        setDialogOpen(false)
        setFile(null)
    }

    const RenderColumnMapping = () => {
        return (
            <>
                <ColumnMapping
                    initialFields={toReadableNames(mappingFields)}
                    options={readableColumnOptions}
                    onSubmit={(values, { setSubmitting, setErrors }) => {
                        const newMapping = fromReadableName(values);
                        setMappingFields(newMapping)
                        setSubmitting(true)
                        post(`${URL_PREFIX}/products`, {
                            fileId: fileId,
                            columns: newMapping
                        }, true)
                            .then(res => {
                                if (res.status !== 200) {
                                    setError('Sorry, we failed to parse the products. Is the file a valid CSV file?')
                                } else {
                                    setError('')
                                    setPreviewOpen(true)
                                    const products: Product[] = res.data.products;
                                    // (currently) does not have categories and id
                                    products.forEach(p => {
                                        if (!p.categories) {
                                            p.categories = []
                                        }
                                        p._id = `import_${Math.random()}`
                                    })
                                    previewProducts.addProducts(products)
                                }
                            }).catch(_err => {
                                setError(`Failed to parse products. Is the file a valid CSV file?`);
                            }).finally(() => {
                                setSubmitting(false);
                            });
                    }} />
                <ProductContext.Provider value={previewProducts}>
                    <ProductPreview open={previewOpen} onClickClose={togglePreviewOpen} />
                </ProductContext.Provider>
            </>
        )
    }


    return Object.keys(mappingFields).length !== 0 ? (
        <Dialog open={true} fullWidth={true}>
            <IconButton className={classes.closeButton} aria-label="close" onClick={discardAll}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <RenderColumnMapping />
            </DialogContent>
        </Dialog>
    ) : (
            <div>
                <div className={classes.submitDiv}>
                    <Button {...props} aria-haspopup="true" variant="contained" onClick={toggleDialogOpen}>Import Products</Button>
                </div>
                <Dialog open={dialogOpen} aria-labelledby="form-dialog-title">
                    <IconButton className={classes.closeButton} aria-label="close" onClick={resetImport}>
                        <CloseIcon />
                    </IconButton>
                    <DialogContent className={classes.content}>
                        <Typography component="h1" variant="h5">Import from a file</Typography>
                        <DialogContentText id="alert-dialog-description">
                            Select the file to import. We currently only support CSV files
                    </DialogContentText>
                        <ProductsDropzone dropzoneOptions={{
                            multiple: false,
                            accept: '.csv',
                            onDropAccepted: (files, _event) => {
                                // Only accepting one file
                                setFile(files[0])
                            }
                        }} />
                    </DialogContent>

                    <FileInfo file={file} />

                    <div className={classes.center}>
                        <Button
                            onClick={
                                () => {
                                    setSubmittingFile(true);
                                    uploadFile(`${URL_PREFIX}/columns`, file!!, true)
                                        .then(res => {
                                            if (res.status !== 200) {
                                                setError('Sorry, we failed to parse the products. Is the file a valid CSV file?')
                                            }
                                            else {
                                                const data: ColumnResponse = res.data;
                                                fileId = data.fileId;
                                                setMappingFields(data.columns)
                                                setError('')
                                            }
                                        }).catch(err => {
                                            setError(`Failed to send the file. ${err}`);
                                        }).finally(() => {
                                            setSubmittingFile(false);
                                        });
                                }}
                            className={classes.submitButton}
                            color="secondary"
                            variant="contained"
                            disabled={submittingFile || !!!file}
                        > Import File</Button >
                    </div>


                    {submittingFile && <LinearProgress />}

                    {error && <Typography align="center" color="error">{error}</Typography>}
                </Dialog>
            </div>
        )
}

type FileProps = { file: File | null }

function FileInfo({ file }: FileProps) {

    const classes = useStyles();

    return !!file ? (
        <b className={classes.center}>{file!.name} - {(file.size / 1000).toFixed(2)} Kb</b>
    ) : (<br />)
}

interface PreviewProps {
    open: boolean,
    onClickClose: () => void
}

function ProductPreview({ open, onClickClose }: PreviewProps) {

    const classes = useStyles();

    return (

        <Dialog open={open} fullWidth={true}>
            <IconButton className={classes.closeButton} aria-label="close" onClick={onClickClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Typography component="h1" variant="h5">Preview Products</Typography>
                <DialogContentText id="alert-dialog-description">
                    Select products to import or edit them.
                    </DialogContentText>
                <ProductContext.Consumer>
                    {({ products }) => (
                        <ul>
                            {products
                                .map((item, index) => <ProductRow key={index} product={item} />)
                            }
                        </ul>
                    )}
                </ProductContext.Consumer>
                <div className={classes.submitDiv}>
                    <Button
                        className={classes.submitButton}
                        aria-haspopup="true"
                        variant="contained"
                        onClick={() => {
                            console.log("TODO: submit all products and update")
                        }}
                    >Import Products</Button>

                    <Button
                        className={classes.submitButton}
                        aria-haspopup="true"
                        variant="contained"
                        onClick={onClickClose}
                    >Cancel</Button>
                </div>
            </DialogContent>

        </Dialog>
    )
}

function toReadableNames(entries: KeyValue): KeyValue {
    const copy = Object.assign({}, entries);
    Object.keys(copy).forEach(key => {
        switch (copy[key]) {
            case 'name':
                copy[key] = 'Product Name';
                break;
            case 'description':
                copy[key] = 'Product Description';
                break;
            case 'price':
                copy[key] = 'Product Price';
                break;
            default:
                copy[key] = 'None (exclude column)';
        }
    });
    return copy;
}

function fromReadableName(entries: KeyValue): KeyValue {
    const copy = Object.assign({}, entries);
    Object.keys(copy).forEach(key => {
        switch (copy[key]) {
            case 'Product Name':
                copy[key] = 'name';
                break;
            case 'Product Description':
                copy[key] = 'description';
                break;
            case 'Product Price':
                copy[key] = 'price';
                break;
            default:
                copy[key] = null;
        }
    });
    return copy;
}