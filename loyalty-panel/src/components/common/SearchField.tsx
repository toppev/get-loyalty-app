import { createStyles, InputAdornment, TextField, Theme } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import { StandardTextFieldProps } from "@material-ui/core/TextField/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        search: {
            marginBottom: '25px',
        },
        input: {
            color: theme.palette.grey[400],
        },
        inputLabel: {
            color: theme.palette.grey[400],
        },
    }));


interface SearchFieldProps extends StandardTextFieldProps {
    setSearch: (search: string) => any
    textColor?: string
}

export default function ({ setSearch, textColor, ...otherProps }: SearchFieldProps) {

    const classes = useStyles();


    return (
        <TextField
            className={classes.search}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon/>
                    </InputAdornment>
                ),
                className: classes.input,
                style: { color: textColor || 'grey' }
            }}
            InputLabelProps={{ className: classes.inputLabel }}
            name="search"
            type="search"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            {...otherProps}
        />
    )
}