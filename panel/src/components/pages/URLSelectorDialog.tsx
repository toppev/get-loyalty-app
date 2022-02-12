import {
  Button,
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import CloseButton from "../common/button/CloseButton"
import makeStyles from '@mui/styles/makeStyles'
import React, { useState } from "react"
import { isDomain } from "../../util/validate"
import HelpTooltip from "../common/HelpTooltip"

type ExternalPage = { url: string, urlType: string }

interface URLSelectorDialogProps {
  open: boolean,
  onSubmit: (urlPage: ExternalPage) => any
  onClose: () => any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    urlField: {
      margin: '10px',
      width: '320px'
    },
    selectBtn: {
      marginTop: '10px',
    },
    urlTypes: {
      margin: '15px 0',
      textAlign: 'start',
    },
    dialogContent: {
      padding: '25px 15px',
      textAlign: 'center',
    }
  }))


type URL_TYPE = { id: string, name: string, description?: string }

const URL_TYPES: URL_TYPE[] = [{
  id: 'external_link',
  name: 'External link'
}, {
  id: 'iframe',
  name: 'Embedded (iframe)',
  description: 'All sites may not work and the user usually does not get logged in.'
}]

export default function URLSelectorDialog(props: URLSelectorDialogProps) {

  const [url, setUrl] = useState('')
  const [urlType, setUrlType] = useState(URL_TYPES[0].id)

  const classes = useStyles()

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <CloseButton onClick={props.onClose}/>
      <DialogContent className={classes.dialogContent}>
        <div>
          <TextField
            className={classes.urlField}
            label="Insert the URL here"
            placeholder="https://example.com/mybusiness"
            multiline
            rows={1}
            maxRows={5}
            variant="outlined"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className={classes.urlTypes}>
          <RadioGroup
            value={urlType}
            onChange={(e, val) => setUrlType(val)}
          >
            {URL_TYPES.map(it => (
              <div key={it.id}>
                <FormControlLabel value={it.id} control={<Radio/>} label={it.name}/>
                {it.description && <HelpTooltip title={it.name} text={it.description}/>}
              </div>
            ))}
          </RadioGroup>
        </div>
        <Button
          disabled={!url || !isDomain(url)} // A simple check is enough
          className={classes.selectBtn}
          variant="contained"
          color="primary"
          onClick={() => props.onSubmit({ url, urlType })}
        >Add URL</Button>
      </DialogContent>
    </Dialog>
  )
}
