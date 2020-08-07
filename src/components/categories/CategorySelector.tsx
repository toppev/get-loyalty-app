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
        // If this shows incorrectly it's because initialCategories are strings and not array of categories (Category)
        // See if the request returns category IDs
        <Autocomplete
            defaultValue={props.initialCategories.map(it => it.name)}
            options={allCategories.map(it => it.name)}
            autoSelect
            multiple
            freeSolo

            onChange={(event, values: any[]) => {
                console.log(values);
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