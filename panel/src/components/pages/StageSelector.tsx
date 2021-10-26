import { createStyles, FormControl, FormControlLabel, Radio, RadioGroup, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { PUBLISHED, UNPUBLISHED } from "./Page"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '20px',
      color: theme.palette.grey[600]
    },
    select: {
      paddingTop: '10px'
    }
  }))

interface StageSelectorProps {
  stage?: string
  onChange: (stage: any) => boolean
}

export default function ({ stage = UNPUBLISHED, onChange }: StageSelectorProps) {

  const classes = useStyles()

  return (
    <FormControl>
      <Typography className={classes.title}>Stage of the page</Typography>

      <RadioGroup name="Dates" value={stage} onChange={(e, val) => onChange(val)}>
        <FormControlLabel
          value={UNPUBLISHED}
          control={<Radio/>}
          checked={stage === UNPUBLISHED}
          label={`${UNPUBLISHED}`}
        />
        <FormControlLabel
          value={PUBLISHED}
          control={<Radio/>}
          checked={stage === PUBLISHED}
          label={`${PUBLISHED}`}
        />
      </RadioGroup>
    </FormControl>
  )
}
