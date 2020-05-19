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
                setCategories(values.map(value => {
                    return typeof value === 'string' ? new Category(`${Math.random()}`, value) : value;
                }));
            }}

            renderInput={params => <TextField {...params} name="category" label="Categories"
                                              placeholder="Press Enter to add more"
            />}
        />)

}