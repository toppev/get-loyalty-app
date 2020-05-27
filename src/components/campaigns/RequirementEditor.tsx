import { makeStyles } from "@material-ui/core/styles";
import { createStyles, TextField, Theme } from "@material-ui/core";
import { Requirement } from "./Campaign";
import React from "react";
import allRequirements from "@toppev/loyalty-campaigns";
import { format } from "../common/StringUtils";

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

export function RequirementEditor(props: RequirementEditorProps) {

    const classes = useStyles()


    const { requirement } = props;

    const requirementType = allRequirements[requirement.type];

    const valueDescriptions = requirementType?.valueDescriptions || [];
    const question = requirement.question ? format(requirement.question, requirement.values) : undefined;

    return (
        <>
            <div>
                {valueDescriptions.map((valueDesc, index) => {
                    const { name, type } = valueDesc;
                    // Textfield type, either "text" or "number"
                    const fieldType = (type === "number" || typeof type === "number") ? "number" : "text";
                    const defaultValue = type === "number" ? undefined : type;
                    return (
                        <TextField
                            key={`val_${index}`}
                            className={classes.textField}
                            name={name}
                            value={defaultValue}
                            type={fieldType}
                            label={`${name} (${type})`}
                            multiline // so the placeholder shows correctly
                            placeholder={`Value used in the question or the system uses when calculating whether the requirement is met (e.g purchase amount or time).`}
                            onChange={(e) => {
                                const copy = { ...requirement };
                                copy.values[index] = e.target.value;
                                props.onChange(copy)
                            }}
                        />
                    )
                })}
            </div>
            {question && <div>
                <TextField
                    className={classes.textField}
                    name="question"
                    type="text"
                    label={`${requirement.name} question`}
                    value={question}
                    placeholder={`Question that the cashier must answer (e.g ${question})`}
                    onChange={(e) => {
                        let copy = { ...requirement };
                        copy.question = e.target.value;
                        props.onChange(copy)
                    }}
                />
            </div>}
        </>
    )
}