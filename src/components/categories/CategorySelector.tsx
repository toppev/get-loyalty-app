import { StandardTextFieldProps, TextField } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from "react";
import { get } from "../../config/axios";
import Category from "./Category";

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
        get(`/category/`).then(res => {
            if (res.status === 200) {
                setAllCategories(res.data);
            }
        }).catch(error => {
        });
    }, []);

    return (
        <Autocomplete
            defaultValue={props.initialCategories}
            options={allCategories}

            renderOption={option => option.name}
            filterSelectedOptions
            autoSelect
            disableOpenOnFocus
            multiple
            freeSolo

            onChange={(event, values: any[]) => {
                setCategories(values.map(value => {
                    return typeof value === 'string' ? new Category(value) : value;
                }));
            }}

            renderInput={params => <TextField {...params} name="category" label="Categories" placeholder="Press Enter to add more"
            />}
        />)

}