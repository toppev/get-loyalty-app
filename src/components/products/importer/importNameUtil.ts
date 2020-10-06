import { KeyValue } from "./ColumnMapping";

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

export {
    toReadableNames,
    fromReadableName
}