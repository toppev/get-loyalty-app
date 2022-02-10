import React from "react"
import { placeholders } from "./Placeholders"
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import Tooltip from "@mui/material/Tooltip"
import makeStyles from '@mui/styles/makeStyles'
import { usePlaceholderContext } from "./placeholderContext"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleDiv: {
      textAlign: 'center',
      color: theme.palette.grey[500],
      marginBottom: '30px'
    },
    typography: {
      fontSize: '20px',
      color: theme.palette.grey[600]
    },
    categoryName: {
      marginTop: '12px'
    }
  }))

interface PlaceholderSelectorProps {
  onSelect: (placeholder: string) => any
}

export default function ({ onSelect }: PlaceholderSelectorProps) {

  const classes = useStyles()
  const placeholderContext = usePlaceholderContext()

  return (
    <div>
      <div className={classes.titleDiv}>
        <Typography variant="h2" className={classes.typography}>
          Placeholder is text that will be replaced with final text when the customer visits the site.
        </Typography>
        <p>
          For example, <i>{"{{ customer.birthday }}"}</i> is replaced with the customers birthday when they
          visit the site.
        </p>
        <p>You can also just type the placeholder.</p>
      </div>
      {Object.entries(placeholders).map(([key, value]) => (
        <div key={key}>
          <TableContainer>
            <Typography variant="h6" className={classes.categoryName}>{value.name}</Typography>
            <Table>
              <TableBody>
                {Object.entries(value.placeholders).map(([property, placeholder]) => {

                  const available = !placeholder.available || placeholder.available(placeholderContext)
                  const text = `{{${value.identifier}.${property}}}`

                  return (
                    <TableRow key={placeholder.name}>
                      <TableCell align="left">{placeholder.name}</TableCell>
                      <TableCell align="center">{placeholder.description}</TableCell>
                      <TableCell align="right">
                        <Tooltip
                          enterDelay={300}
                          title={available === true ? (
                            <Typography>Select <i>{text}</i> placeholder</Typography>
                          ) : (
                            <>
                              <Typography>Unavailable</Typography>
                              {typeof available === 'string' && available}
                            </>
                          )}
                        >
                          <div>
                            <Button
                              disabled={available !== true}
                              variant="contained"
                              color={available ? "primary" : "inherit"}
                              size="small"
                              onClick={() => onSelect(text)}
                            >Select</Button>
                          </div>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
  )
}
