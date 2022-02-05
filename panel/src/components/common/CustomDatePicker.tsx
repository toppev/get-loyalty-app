import { styled } from "@material-ui/styles"
import { KeyboardDateTimePicker } from "@material-ui/pickers"

const CustomDatePicker = styled(KeyboardDateTimePicker)({
  '& label': {
    whiteSpace: 'nowrap',
  }
})

export default CustomDatePicker
