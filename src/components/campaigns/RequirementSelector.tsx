import { Checkbox, createStyles, Input, ListItemText, Select, Theme } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useState } from "react";
import { Requirement } from "./Campaign";
import allRequirements from "@toppev/loyalty-campaigns";
import { RequirementEditor } from "./RequirementEditor";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            margin: '12px 0px'
        },
        select: {
            width: '100%',
            margin: '4px 0px'
        },
    }));

interface RequirementSelectorProps {
    initialRequirements: Requirement[] | undefined
    onChange: (values: Requirement[]) => any
}

export default function (props: RequirementSelectorProps) {

    const classes = useStyles();

    const [requirements, setRequirements] = useState<Requirement[]>(props.initialRequirements || []);
    const [open, setOpen] = useState(false);

    useEffect(() => props.onChange(requirements), [props, requirements])

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selected = event.target.value as string[];
        setOpen(false);
        const values: Requirement[] = [];
        selected.forEach(str => {
            const type = allRequirements[str];
            if (type) {
                // Create a Requirement from the RequirementType
                const newRequirement = new Requirement(type.name, str, [], type.question);
                values.push(newRequirement);
            }
        })
        setRequirements(values);
    };

    return (
        <div className={classes.paper}>
            <div>
                <Select
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    className={classes.select}
                    multiple={true}
                    value={requirements.map(req => req.type)}
                    onChange={handleChange}
                    input={<Input/>}
                    renderValue={selected => (selected as string[]).map(s => allRequirements[s].name).join(', ')}
                    label="Campaign Requirements"
                    inputProps={{
                        name: 'requirements',
                    }}
                >
                    {Object.entries(allRequirements).map(([key, value]) => {
                        const { name, description } = value;
                        return (
                            <MenuItem value={key} key={`item_${key}`}>
                                <Checkbox checked={requirements.some(r => r.type === key)}/>
                                <ListItemText primary={name} secondary={description}/>
                            </MenuItem>
                        )
                    })}
                </Select>
            </div>
            <div>
                {requirements.map(req => (
                    <RequirementEditor
                        key={`edit_${req.type}`}
                        requirement={req}
                        onChange={updatedReq => {
                            // TODO: keep order
                            return setRequirements([...requirements.filter(r => r.type !== updatedReq.type), updatedReq])
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
