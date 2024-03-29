import { Checkbox, Input, ListItemText, Select, SelectChangeEvent, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from "react"
import { Requirement } from "./Campaign"
import allRequirements from "@toppev/getloyalty-campaigns"
import { RequirementEditor } from "./RequirementEditor"
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: '12px 0px'
    },
    select: {
      width: '100%',
      margin: '4px 0px'
    },
  }))

interface RequirementSelectorProps {
  initialRequirements: Requirement[] | undefined
  onChange: (values: Requirement[]) => any
}

export default function RequirementSelector(props: RequirementSelectorProps) {

  const classes = useStyles()

  const [requirements, setRequirements] = useState<Requirement[]>(props.initialRequirements || [])
  const [open, setOpen] = useState(false)

  useEffect(() => props.onChange(requirements), [props, requirements])

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    console.log(typeof event.target.value, event.target.value)
    const selected = event.target.value as unknown as string[]
    setOpen(false)
    const values: Requirement[] = []
    selected.forEach(str => {
      const type = allRequirements[str]
      if (type) {
        // Create a Requirement from the RequirementType
        const newRequirement = new Requirement(str, [], type.question)
        values.push(newRequirement)
      }
    })
    setRequirements(values)
  }

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
          renderValue={selected => (selected as unknown as string[]).map(s => allRequirements[s].name).join(', ')}
          label="Campaign Requirements"
          inputProps={{
            name: 'requirements',
          }}
        >
          {Object.entries(allRequirements).map(([key, value]) => {
            const { name, description } = value
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
        {requirements.map(req => {
          return (
            <RequirementEditor
              key={`edit_${req.type}`}
              requirement={req}
              onChange={updatedReq => {
                const newRequirements = [...requirements]
                const index = requirements.findIndex(old => old.type === updatedReq.type)
                if (index !== -1) newRequirements[index] = updatedReq
                else newRequirements.push(updatedReq)
                setRequirements(newRequirements)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
