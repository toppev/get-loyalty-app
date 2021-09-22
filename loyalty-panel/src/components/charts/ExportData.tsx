import {
  Box,
  Button,
  Collapse,
  createStyles,
  Divider,
  FormControlLabel,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Theme,
  Typography
} from "@material-ui/core"
import React, { useState } from "react"
import DownloadIcon from '@material-ui/icons/GetApp'
import { backendURL, get } from "../../config/axios"
import KeyIcon from '@material-ui/icons/VpnKey'
import { downloadFile } from "../../util/download"
import CopyToClipboard from "../common/CopyToClipboarad"
import LinkIcon from "@material-ui/icons/Link"

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exportTitle: {
      fontSize: '18px',
      textAlign: 'center',
      margin: '15px 0 20px 0',
      color: theme.palette.grey[800],
    },
    p: {
      fontSize: '16px',
      color: theme.palette.grey[600],
      margin: '25px 0'
    },
    center: {
      textAlign: 'center'
    },
    documentation: {
      minHeight: '800px',
    },
    exportSectionPaper: {
      margin: '20px auto',
      width: '95%',
      padding: '25px',
      height: 'fit-content',
      [theme.breakpoints.up('sm')]: {
        width: '600px',
        margin: '40px',
      },
    },
    code: {
      backgroundColor: theme.palette.grey[100]
    },
    divider: {
      margin: '35px 0'
    }
  }))

export default function () {

  const classes = useStyles()

  const supportedTypes = [{
    type: '.json',
    description: 'JSON (.json)',
    endpoint: backendURL + '/business/customers?limit=-1',
  }]

  const [dataType, setDataType] = React.useState(supportedTypes[0])
  const fileName = "customers-" + new Date().toISOString().slice(0, 10) + dataType.type

  return (
    <Box display="flex" flexWrap="wrap" className={classes.documentation}>
      <Paper className={classes.exportSectionPaper}>
        <Typography variant="h3" className={classes.exportTitle}>Export Customers</Typography>
        <p className={classes.p}>
          Download current customers (for example, to import them in excel)
        </p>

        {
          // Hide until there are more options
          supportedTypes.length > 1 &&
          <>
            <p className={classes.p}>Select data type:</p>
            <RadioGroup
              value={dataType.type}
              onChange={e => setDataType(supportedTypes.find(it => it.type === e.target.type)!!)}
            >
              {supportedTypes.map(it => (
                <FormControlLabel value={it.type} control={<Radio/>} label={it.description}/>
              ))}
            </RadioGroup>
          </>
        }

        <Button
          size="small"
          variant="contained"
          startIcon={<DownloadIcon/>}
          onClick={() => {
            console.log(dataType.endpoint)
            get(dataType.endpoint, true).then(res => {
              downloadFile(JSON.stringify(res.data, null, 2), fileName)
            })
          }}
        >
          Download ({dataType.type})
        </Button>

      </Paper>
    </Box>
  )
}
