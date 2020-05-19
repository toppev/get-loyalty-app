import {
    Button,
    ButtonProps,
    createStyles,
    Dialog,
    DialogContent,
    DialogContentText,
    IconButton,
    LinearProgress,
    makeStyles,
    Theme,
    Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import React, { ReactElement, useState } from 'react';
import { post, uploadFile } from '../../../config/axios';
import RequestError from '../../common/requestError';
import Product from '../Product';
import ProductFormDialog from '../ProductFormDialog';
import ProductRow from '../ProductRow';
import ColumnMapping, { KeyValue } from './ColumnMapping';
import ProductsDropzone from './ImportDropzone';
import { fromReadableName, toReadableNames } from './importNameUtil';

const URL_PREFIX = 'http://localhost:8080'

let fileId: string | null = null;

const readableColumnOptions = ['Product Name', 'Product Description', 'Product Price', 'None (exclude column)'];

interface ImportProductsProps extends ButtonProps {
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


export default function ImportProducts(props: ImportProductsProps): ReactElement {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [mappingFields, setMappingFields] = useState<KeyValue>({});

    const [error, setError] = useState<RequestError | undefined>();
    const [previewProducts, setPreviewProducts] = useState<Product[]>([]);

    const classes = useStyles();

    const setErrorMessage = (message: string) => {
        setError({ message: message, retry: undefined })
    }

    const toggleDialogOpen = () => {
        setDialogOpen(!dialogOpen);
        setError({})
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
                                    setErrorMessage('Sorry, we failed to parse the products. Is the file a valid CSV file?')
                                } else {
                                    setError({});
                                    setPreviewOpen(true)
                                    const products: Product[] = res.data.products;
                                    // (currently) does not have categories and id
                                    products.forEach(p => {
                                        if (!p.categories) {
                                            p.categories = []
                                        }
                                        p._id = `import_${Math.random()}`
                                    });
                                    setPreviewProducts(products);
                                }
                            }).catch(_err => {
                            setErrorMessage(`Failed to parse products. Is the file a valid CSV file?`);
                        }).finally(() => setSubmitting(false));
                    }}/>
                <ProductPreview
                    open={previewOpen}
                    initialProducts={previewProducts}
                    onClickClose={() => setPreviewOpen(!previewOpen)}
                />
            </>
        )
    }


    return Object.keys(mappingFields).length !== 0 ? (
        <Dialog open={true} fullWidth={true}>
            <IconButton className={classes.closeButton} aria-label="close" onClick={discardAll}>
                <CloseIcon/>
            </IconButton>
            <DialogContent>
                <RenderColumnMapping/>
            </DialogContent>
        </Dialog>
    ) : (
        <div>
            <div className={classes.submitDiv}>
                <Button
                    {...props}
                    aria-haspopup="true"
                    variant="contained"
                    onClick={toggleDialogOpen}
                    startIcon={(<GetAppIcon/>)}
                >Import Products</Button>
            </div>
            <Dialog open={dialogOpen} aria-labelledby="form-dialog-title">
                <IconButton className={classes.closeButton} aria-label="close" onClick={resetImport}>
                    <CloseIcon/>
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
                    }}/>
                </DialogContent>

                <FileInfo file={file}/>

                <div className={classes.center}>
                    <Button
                        onClick={
                            () => {
                                setSubmitting(true);
                                uploadFile(`${URL_PREFIX}/columns`, file!!, true)
                                    .then(res => {
                                        if (res.status !== 200) {
                                            setErrorMessage('Sorry, we failed to parse the products. Is the file a valid CSV file?')
                                        } else {
                                            const data: ColumnResponse = res.data;
                                            fileId = data.fileId;
                                            setMappingFields(data.columns)
                                            setError({});
                                        }
                                    }).catch(err => {
                                    setErrorMessage(`Failed to send the file. ${err}`);
                                }).finally(() => {
                                    setSubmitting(false);
                                });
                            }}
                        className={classes.submitButton}
                        color="secondary"
                        variant="contained"
                        disabled={submitting || !file}
                        startIcon={(<CloudUploadIcon/>)}
                    > Import File</Button>
                </div>


                {submitting && <LinearProgress/>}

                {error && <Typography align="center" color="error">{error.message}</Typography>}
            </Dialog>
        </div>
    )
}

type FileProps = { file: File | null }

function FileInfo({ file }: FileProps) {

    const classes = useStyles();

    return !!file ? (
        <b className={classes.center}>{file.name} - {(file.size / 1000).toFixed(2)} Kb</b>
    ) : (<br/>)
}


interface PreviewProps {
    open: boolean,
    initialProducts: Product[]
    onClickClose: () => void
}

function ProductPreview({ open, onClickClose, initialProducts }: PreviewProps) {

    const classes = useStyles();

    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();

    const [products, setProducts] = useState<Product[]>(initialProducts);

    return (
        <Dialog open={open} fullWidth={true}>
            <IconButton className={classes.closeButton} aria-label="close" onClick={onClickClose}>
                <CloseIcon/>
            </IconButton>
            <DialogContent>
                <Typography component="h1" variant="h5">Preview Products</Typography>
                <DialogContentText id="alert-dialog-description">
                    Select products to import or edit them.
                </DialogContentText>

                {products.map((item, index) => (
                    <ProductRow key={index} product={item}
                                startEditing={(product) => setEditingProduct(product)}/>
                ))}

                <ProductFormDialog
                    open={formOpen || !!editingProduct}
                    initialProduct={editingProduct}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }}
                    onProductSubmitted={(product: Product) => {
                        // Editing or adding a new product to the preview
                        // So update state only
                        if (!editingProduct) {
                            setProducts([...products, product])
                        } else {
                            setProducts([product, ...products.filter(p => p._id !== product._id)])
                        }
                        setFormOpen(false);
                        setEditingProduct(undefined);
                    }}/>

                <div className={classes.submitDiv}>
                    <Button
                        className={classes.submitButton}
                        aria-haspopup="true"
                        variant="contained"
                        onClick={() => {
                            // TODO: submit all products
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
