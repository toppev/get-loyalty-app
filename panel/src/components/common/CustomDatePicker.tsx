import { styled } from "@mui/styles"
import { KeyboardDateTimePicker } from "@material-ui/pickers"

const CustomDatePicker = styled(KeyboardDateTimePicker)({
  '& label': {
    whiteSpace: 'nowrap',
  }
})

export default CustomDatePicker
