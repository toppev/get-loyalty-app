import { StandardTextFieldProps, TextField } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { createCategories, getAllCategories } from "../../services/categoryService";

interface Props extends StandardTextFieldProps {
    initialCategories: Category[],
    onCategoriesUpdate: (categories: Category[]) => any
}


export default function (props: Props) {

    const [categories, setCategories] = useState<Category[]>(props.initialCategories);
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    useEffect(() => {
        props.onCategoriesUpdate(categories);
    }, [categories, props])

    useEffect(() => {
        getAllCategories().then(res => {
            if (res.status === 200) {
                setAllCategories(res.data);
            }
        })
    }, []);

    return (
        // FIXME: does not render new values properly and is complaining of changing defaultValue because 1 editor is used for all products
        // renderOption crashes and getOptionLabel only renders default values correctly
        <Autocomplete
            defaultValue={props.initialCategories}
            options={allCategories}
            autoSelect
            multiple
            freeSolo
            getOptionLabel={c => c.name}

            onChange={(event, values: any[]) => {
                const newValues = values.map(value => {
                    return typeof value === 'string' ? new Category({ id: `${Math.random()}`, name: value }) : value;
                })
                createCategories(newValues).then(setCategories)
            }}

            renderInput={params => (
                <TextField
                    {...params}
                    name="category"
                    label="Categories"
                    placeholder="Press Enter to add more"
                />
            )}
        />)

}