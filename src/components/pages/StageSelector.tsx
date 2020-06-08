import { createStyles, FormControl, InputLabel, Select, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { PUBLISHED, UNPUBLISHED } from "./Page";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(2),
            width: 180,
        },
        title: {
            fontSize: '22px',
        },
        select: {
            paddingTop: '10px'
        }
    }));

interface StageSelectorProps {
    initialStage?: string
    onChange: (stage: any) => boolean
}

export default function ({ initialStage, onChange }: StageSelectorProps) {

    const classes = useStyles();

    const [stage, setStage] = useState<any>(initialStage || UNPUBLISHED);

    const handleChange = (value: any) => {
        if (onChange(value)) {
            setStage(value)
        }
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel className={classes.title} htmlFor="page-stage-select">Stage of the Page</InputLabel>
            <Select
                className={classes.select}
                native
                value={stage}
                onChange={(e) => handleChange(e.target.value)}
                label="Page Stage"
                inputProps={{
                    name: 'stage',
                    id: 'page-stage-select',
                }}
            >
                <option value={UNPUBLISHED}>{UNPUBLISHED}</option>
                <option value={PUBLISHED}>{PUBLISHED}</option>
            </Select>
        </FormControl>
    )
}