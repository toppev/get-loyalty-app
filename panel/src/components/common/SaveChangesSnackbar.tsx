import { Button, Grid, Snackbar, SnackbarContent, Theme } from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import SaveIcon from '@mui/icons-material/Save'
import WarningIcon from '@mui/icons-material/Warning'
import React from 'react'
import { Prompt } from 'react-router-dom'

interface SaveChangesProps {
  open: boolean,
  buttonDisabled?: boolean
  onSave: () => any,
  onClose?: Function,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    saveButton: {
      marginLeft: "2px",
    },
    closeMenuButton: {
      marginRight: 'auto',
      marginLeft: 0,
    },
  }))

export default function (props: SaveChangesProps) {

  const classes = useStyles()

  const blockLeaving = props.open && !props.buttonDisabled // Allow leaving if the button is disabled, e.g if it gets stuck because I suck
  // Blocks leaving the site
  window.onbeforeunload = blockLeaving ? () => true : null


  return (
    <>
      {/* Blocks navigating (e.g navigator links) */}
      <Prompt
        when={blockLeaving}
        message='You have unsaved changes, are you sure you want to leave?'
      />
      <Snackbar
        open={props.open}
        onClose={() => props.onClose && props.onClose()}
      >
        <SnackbarContent
          message={
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <WarningIcon color="secondary"/>
              </Grid>
              <Grid item><p> Careful! You have unsaved changes!</p></Grid>
            </Grid>
          }
          action={
            <div>
              < Button
                disabled={props.buttonDisabled}
                variant="contained"
                color="primary"
                startIcon={(<SaveIcon/>)}
                onClick={() => {
                  props.onSave()
                }}
                className={classes.saveButton}
              > Save</Button>
            </div>
          }
        />
      </Snackbar>
    </>
  )
}
