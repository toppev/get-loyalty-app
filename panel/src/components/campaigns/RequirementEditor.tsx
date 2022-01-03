import { makeStyles } from "@material-ui/core/styles"
import { createStyles, FormControlLabel, Radio, RadioGroup, TextField, Theme } from "@material-ui/core"
import { getRequirementName, Requirement } from "./Campaign"
import React, { useEffect } from "react"
import allRequirements from "@toppev/getloyalty-campaigns"
import { format } from "../common/StringUtils"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      width: '100%',
      margin: '10px 0px'
    },
    valueLabel: {
      textTransform: 'capitalize'
    }
  }))

interface RequirementEditorProps {
  requirement: Requirement
  /**
   * Called when the requirement changes
   * @param requirement the new requirement (cloned object)
   */
  onChange: (requirement: Requirement) => any
}

const placeholderText = `Value used in the question or the system uses when calculating whether the requirement is met (e.g purchase amount or time).`

export function RequirementEditor(props: RequirementEditorProps) {

  const classes = useStyles()
  const { requirement } = props

  const valueDescriptions = allRequirements[requirement.type]?.valueDescriptions || []
  const question = requirement.question ? format(requirement.question, requirement.values) : undefined

  const onChange = (index: number, val: any) => {
    const copy = { ...requirement }
    copy.values[index] = val
    props.onChange(copy)
  }

  return (
    <>
      <div>
        {valueDescriptions.map((valueDesc, index: number) =>
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
            const copy = { ...requirement }
            copy.question = e.target.value
            props.onChange(copy)
          }}
        />
      </div>}
    </>
  )
}


function ValueSelector(valueDescription: { name: string, type: any }, onChange: (index: number, val: any) => void, index: number, requirement: Requirement) {
  const classes = useStyles()
  const { name, type } = valueDescription

  const isArray = Array.isArray(type)
  const currentValue = requirement.values[index]
  // Either "text", "number", string array or initial value
  const initValue = currentValue || (["number", "string"].includes(type) ? undefined : isArray ? type[0] : type)

  useEffect(() => {
    // make sure the default value is updated
    if (currentValue !== initValue) onChange(index, initValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isArray) {
    return (
      <div key={`val_${index}_${name}`}>
        <p>{placeholderText}</p>
        <b>{name}</b>
        <RadioGroup
          defaultValue={type[0]} // init with first value
          onChange={e => onChange(index, e.target.value)}
        >
          {type.map((key: string) => {
            return (
              <FormControlLabel
                key={`item_${key}`}
                control={<Radio value={key} checked={currentValue === key}/>}
                label={(
                  <span className={classes.valueLabel}>{key}</span>
                )}
              />
            )
          })}
        </RadioGroup>
      </div>
    )
  }
  const fieldType = (type === "number" || typeof type === "number") ? "number" : "text"
  return (
    <TextField
      key={`val_${index}_${name}`}
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
