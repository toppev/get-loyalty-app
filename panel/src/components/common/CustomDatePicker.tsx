import { TextField } from "@mui/material"
import { styled } from "@mui/styles"
import { DateTimePicker } from "@mui/lab"
import React from "react"

const StyledDatePicker = styled(DateTimePicker)({
  '& label': {
    whiteSpace: 'nowrap',
  }
})

interface CustomDatePickerProps {
  label: string
  value: Date | undefined
  setValue: (date: Date | undefined) => any
  showTodayButton?: boolean
  disabled?: boolean
  disablePast?: boolean
}

function CustomDatePicker({ setValue, ...props }: CustomDatePickerProps) {

  return (
    <StyledDatePicker
      renderInput={(params) => (<TextField {...params} />)}
      onChange={date => setValue(date ? date as Date : undefined)}
      {...props}
    />
  )
}

export default CustomDatePicker
