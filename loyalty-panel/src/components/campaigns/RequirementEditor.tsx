import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, createStyles, InputLabel, ListItemText, Select, TextField, Theme } from "@material-ui/core";
import { getRequirementName, Requirement } from "./Campaign";
import React from "react";
import allRequirements from "@toppev/loyalty-campaigns";
import { format } from "../common/StringUtils";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            width: '100%',
            margin: '10px 0px'
        }
    }));

interface RequirementEditorProps {
    requirement: Requirement
    /**
     * Called when the requirement changes
     * @param requirement the new requirement (cloned object)
     */
    onChange: (requirement: Requirement) => any
}

const placeholderText = `Value used in the question or the system uses when calculating whether the requirement is met (e.g purchase amount or time).`;

export function RequirementEditor(props: RequirementEditorProps) {

    const classes = useStyles()
    const { requirement } = props;

    const valueDescriptions = allRequirements[requirement.type]?.valueDescriptions || [];
    const question = requirement.question ? format(requirement.question, requirement.values) : undefined;

    const onChange = (index: number, val: any) => {
        const copy = { ...requirement };
        copy.values[index] = val;
        props.onChange(copy)
    }

    return (
        <>
            <div>
                {valueDescriptions.map((valueDesc, index) =>
                    ValueSelector(valueDesc, onChange, index, requirement))}
            </div>
            {question && <div>
                <TextField
                    className={classes.textField}
                    name="question"
                    type="text"
                    label={`${getRequirementName(requirement)} question`}
                    value={question}
                    placeholder={`Question that the cashier must answer (e.g ${question})`}
                    onChange={(e) => {
                        const copy = { ...requirement };
                        copy.question = e.target.value;
                        props.onChange(copy)
                    }}
                />
            </div>}
        </>
    )
}


function ValueSelector(valueDescription: { name: string, type: any }, onChange: (index: number, val: any) => void, index: number, requirement: Requirement) {
    const classes = useStyles()
    const { name, type } = valueDescription;

    const isArray = Array.isArray(type);
    const currentValue = requirement.values[index];
    // Either "text", "number", string array or initial value
    const initValue = currentValue || (["number", "string"].includes(type) ? undefined : isArray ? type[0] : type);
    if (currentValue !== initValue) {
        onChange(index, initValue) // make sure the default value is updated
    }

    if (isArray) {
        return (
            <>
                <InputLabel id="requirement-value-select">{placeholderText}</InputLabel>
                <Select
                    labelId="requirement-value-select"
                    defaultValue={type[0]} // init with first value
                    onChange={e => onChange(index, e.target.value)}
                >
                    {type.map((key: string) => {
                        return (
                            <MenuItem value={key} key={`item_${key}`}>
                                <Checkbox checked={currentValue === key}/>
                                <ListItemText primary={name} secondary={key}/>
                            </MenuItem>
                        )
                    })}
                </Select>
            </>
        )
    }
    const fieldType = (type === "number" || typeof type === "number") ? "number" : "text";
    return (
        <TextField
            key={`val_${index}`}
            className={classes.textField}
            name={name}
            defaultValue={initValue}
            type={fieldType}
            label={`${name} (${fieldType})`}
            multiline // so the placeholder shows correctly
            placeholder={placeholderText}
            onChange={e => onChange(index, e.target.value)}
        />
    )
}
