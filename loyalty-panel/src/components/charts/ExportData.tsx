import { Box, Button, createStyles, FormControlLabel, makeStyles, Paper, Radio, RadioGroup, Theme, Typography } from "@material-ui/core"
import React from "react"
import DownloadIcon from '@material-ui/icons/GetApp'
import { backendURL } from "../../config/axios"

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
      margin: 'auto',
      minWidth: '95%',
      padding: '25px',
      height: 'fit-content',
      [theme.breakpoints.up('sm')]: {
        minWidth: '600px',
        margin: '40px',
      },
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
          Download current customers or use the API endpoint to import them automatically (e.g in excel)
        </p>

        <p className={classes.p}>Select data type:</p>
        {
          // Hide until there are more options
          supportedTypes.length > 1 &&
          <RadioGroup
            value={dataType.type}
            onChange={e => setDataType(supportedTypes.find(it => it.type === e.target.type)!!)}
          >
            {supportedTypes.map(it => (
              <FormControlLabel value={it.type} control={<Radio/>} label={it.description}/>
            ))}
          </RadioGroup>
        }

        <Button
          size="small"
          variant="contained"
          startIcon={<DownloadIcon/>}
        >
          <a href={dataType.endpoint} download={fileName}>Download ({dataType.type})</a>
        </Button>
      </Paper>
    </Box>
  )
}
