import { Button, ButtonProps, createStyles, Dialog, DialogContent, DialogContentText, IconButton, LinearProgress, makeStyles, Theme, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { ReactElement, useState } from 'react';
import { useProductOperations } from '../../../App';
import { post, uploadFile } from '../../../config/axios';
import ColumnMapping, { KeyValue } from './ColumnMapping';
import ProductContext from '../ProductContext';
import ProductRow from '../ProductRow';
import ProductsDropzone from './ImportDropzone';
import Product from '../Product';

const URL_PREFIX = '/converter'

let fileId: string | null = null;

const readableColumnOptions = ['Product Name', 'Product Description', 'Product Price', 'None (exclude column)'];

interface Props extends ButtonProps {

}

interface ColumnResponse {
    fileId: string,
    extension: string,
    columns: KeyValue
}

interface ProductResponse {
    products: Product[]
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
        }
    }));


export default function ImportProducts(props: Props): ReactElement {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [submittingFile, setSubmittingFile] = useState(false);
    const [mappingFields, setMappingFields] = useState<KeyValue>({});

    const previewProducts = useProductOperations()

    const classes = useStyles();

    const toggleOpen = () => {
        setDialogOpen(!dialogOpen);
    }

    const RenderNextAction = () => {
        return !!mappingFields ? (
            <ColumnMapping
                open={!!mappingFields}
                initialFields={toReadableNames(mappingFields)}
                options={readableColumnOptions}
                onSubmit={(_values, { setSubmitting, setErrors }) => {
                    post(`${URL_PREFIX}/products`, {})
                        .then(res => {
                            if (res.status !== 200) {
                                setError('Sorry, we failed to parse the products. IS the file a valid CSV file?')
                            } else {
                                const data: ProductResponse = res.data;
                                // TODO: Open product preview
                                previewProducts.setProducts(data.products)
                            }
                        }).catch(_err => {
                            setError(`Failed to parse products. Is the file a valid CSV file?`);
                        }).finally(() => {
                            setSubmitting(false);
                        });
                }} />
        ) : (
                <div>
                    <Button onClick={() => {
                        setSubmittingFile(true);
                        uploadFile(`${URL_PREFIX}/columns`, file!!)
                            .then(res => {
                                if (res.status !== 200) {
                                    setError('Sorry, we failed to parse the products. IS the file a valid CSV file?')
                                }
                                else {
                                    const data: ColumnResponse = res.data;
                                    fileId = data.fileId;
                                    setMappingFields(data.columns)
                                }
                            }).catch(err => {
                                setError(`${err} Failed to send the file`);
                            }).finally(() => {
                                setSubmittingFile(false);
                            });
                    }} color="secondary" disabled={submittingFile || !!file}>Import File</Button>

                    {submittingFile && <LinearProgress />}

                    <ProductContext.Provider value={previewProducts}>
                        <ProductPreview open={dialogOpen} onClickClose={toggleOpen} />
                    </ProductContext.Provider>


                </div>
            )
    }

    return (
        <div>
            <Button {...props} aria-haspopup="true" onClick={toggleOpen}>Import Products</Button>

            <Dialog open={dialogOpen} aria-labelledby="form-dialog-title">
                <IconButton className={classes.closeButton} aria-label="close" onClick={toggleOpen}>
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
                            setFile(files[0])
                        }
                    }} />
                </DialogContent>

                <RenderNextAction />

                {error && <Typography align="center" color="error">{error}</Typography>}
            </Dialog>
        </div>
    )
}

interface PreviewProps {
    open: boolean,
    onClickClose: () => void
}

function ProductPreview(props: PreviewProps) {

    const classes = useStyles();

    return (

        <Dialog open={props.open}>
            <IconButton className={classes.closeButton} aria-label="close" onClick={props.onClickClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Typography component="h1" variant="h5">Import from a file</Typography>
                <DialogContentText id="alert-dialog-description">
                    Select the file to import. We currently only support CSV files
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