import { StandardTextFieldProps, TextField } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from "react";

interface Props extends StandardTextFieldProps {
    initialCategories: string[],
    onCategoriesUpdate: (categories: string[]) => any
}


export default function (props: Props) {

    const [categories, setCategories] = useState<string[]>(props.initialCategories);
    // TODO: fetch from server (at least a few) or something
    const allCategories = ["pizza", "kebab", "kebab pizza", "pasta"]

    useEffect(() => {
        props.onCategoriesUpdate(categories);
    }, [categories, props])

    return (
        <Autocomplete
            defaultValue={props.initialCategories}
            options={allCategories}
            filterSelectedOptions
            autoSelect
            disableOpenOnFocus
            multiple
            freeSolo

            onChange={(event, values) => {
                setCategories(values);
            }}

            renderInput={params => <TextField {...params} name="category" label="Categories" placeholder="Press Enter to add more"
            />}
        />)

}