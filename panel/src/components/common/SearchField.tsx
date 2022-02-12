import { InputAdornment, TextField, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import SearchIcon from "@mui/icons-material/Search"
import React from "react"
import { StandardTextFieldProps } from "@mui/material/TextField/TextField"
import makeStyles from '@mui/styles/makeStyles'

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
  }))


interface SearchFieldProps extends StandardTextFieldProps {
  setSearch: (search: string) => any
  textColor?: string
}

export default function SearchField({ setSearch, textColor, ...otherProps }: SearchFieldProps) {

  const classes = useStyles()


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
