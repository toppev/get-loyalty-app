import { Button, createStyles, Dialog, DialogContent, TextField, Theme } from "@material-ui/core";
import CloseButton from "../common/button/CloseButton";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { isDomain } from "../../util/validate";

interface URLSelectorDialogProps {
  open: boolean,
  onSubmit: (url: string) => any
  onClose: () => any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    urlField: {
      margin: '10px',
      width: '320px'
    },
    selectBtn: {
      marginTop: '10px'
    },
    dialogContent: {
      padding: '25px 15px',
      textAlign: 'center',
    }
  }));


export default function (props: URLSelectorDialogProps) {

  const [url, setUrl] = useState('');

  const classes = useStyles();

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <CloseButton onClick={props.onClose}/>
      <DialogContent className={classes.dialogContent}>
        <div>
          <TextField
            className={classes.urlField}
            label="Insert url here"
            multiline
            rows={1}
            rowsMax={5}
            variant="outlined"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Button
          disabled={!url || !isDomain(url)} // A simple check is enough
          className={classes.selectBtn}
          variant="contained"
          color="primary"
          onClick={() => props.onSubmit(url)}
        >Select</Button>
      </DialogContent>
    </Dialog>
  )
}
