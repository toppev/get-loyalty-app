import { Button, createStyles, Grid, LinearProgress, makeStyles, MenuItem, Select, Theme, Typography } from "@material-ui/core"
import { Field, Form, Formik, FormikHelpers } from "formik"
import React from "react"
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline'

interface Props {
  initialFields: KeyValue,
  options: string[]
  onSubmit: (mappings: KeyValue, actions: FormikHelpers<KeyValue>) => void
}

export interface KeyValue {
  [key: string]: string | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      margin: '30px 0px 10px 0px'
    },
    content: {
      marginTop: '20px',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    row: {
      marginTop: '20px'
    },
    option: {},
    columnName: {
      marginRight: '25px',
      fontStyle: 'italic'
    },
    field: {
      marginLeft: '25px'
    },
    submitDiv: {
      textAlign: 'center',
    },
  }))

export default function (props: Props) {

  const classes = useStyles()

  return (
    <div className={classes.content}>
      <Typography variant="h5">Column Mapping</Typography>
      <br/>
      Please select where the value of each columns belongs.
      <br/>
      Select "None" to exclude the field.
      <Formik
        initialValues={props.initialFields}
        onSubmit={props.onSubmit}
      >{({ submitForm, isSubmitting, handleChange }) => (
          <Form>
            {Object.keys(props.initialFields).map(key => {
              const value = props.initialFields[key]
              return (
                <Grid
                  className={classes.row}
                  container
                  spacing={3}
                  direction="row"
                  justify="center"
                  alignItems="center"
                  key={key}
                >
                  <Grid item xs={12} sm={5}>
                    <Typography className={classes.columnName} align="justify">{key}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    < Field
                      className={classes.field}
                      component={Select}
                      type="text"
                      name={key}
                      defaultValue={value}
                      onChange={(event: any) => {
                        handleChange(key)(event)
                      }}
                    >
                      {props.options.map(option => {
                        return (
                          <MenuItem className={classes.option} key={option} value={option}>
                            {option}
                          </MenuItem>
                        )
                      })}
                    </Field>
                  </Grid>
                </Grid>
              )
            })}
            <div className={classes.submitDiv}>
              <Button
                className={classes.submitButton}
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={(<ViewHeadlineIcon/>)}
                onClick={submitForm}>Preview Products</Button>

              {isSubmitting && <LinearProgress/>}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )

}
