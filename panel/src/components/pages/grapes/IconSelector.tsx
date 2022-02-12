import React, { useState } from "react"
import CloseButton from "../../common/button/CloseButton"
import { Button, Collapse, Dialog, Divider, Grid, Paper, TextField, Theme } from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import SVGIcons from "./SVGIcons"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import PageIcon from "../PageIcon"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      textAlign: 'center'
    },
    selectButton: {},
    iconDiv: {
      margin: '7px',
      textAlign: 'center'
    },
    iconsGrid: {
      maxHeight: '500px',
      overflow: 'auto'
    },
    customHtmlDiv: {
      textAlign: 'center',
      margin: '10px 0px',
      padding: '6px'
    },
    htmlField: {
      width: '85%',
    },
    saveButton: {
      marginTop: '8px'
    },
    info: {
      color: theme.palette.info.light
    },
    previewDiv: {
      textAlign: 'center'
    },
    previewPaper: {
      width: '140px',
      margin: 'auto'
    }
  }))

interface IconSelectorProps {
  /**
   * When user selects an icon. Returns HTML
   */
  onSubmit: (icon: string) => any
  initialIcon: string
}

export default function IconSelector(props: IconSelectorProps) {

  const classes = useStyles()
  const icons = SVGIcons

  const { onSubmit, initialIcon } = props

  const [open, setOpen] = useState(false)

  const [customOpen, setCustomOpen] = useState(false)
  const [html, setHtml] = useState(icons.includes(initialIcon) ? '' : initialIcon)

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        onClick={() => setOpen(true)}
      >Select Icon</Button>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <CloseButton onClick={() => setOpen(false)}/>
        <Grid container className={classes.iconsGrid}>
          {icons.map((icon, i) => (
            <Grid item xs={4} key={i}>
              <SeletableIcon icon={icon} onSelect={() => {
                setOpen(false)
                onSubmit(icon)
              }}/>
            </Grid>
          ))}
        </Grid>
        <Divider/>
        <div>
          <div className={classes.customHtmlDiv}>
            <Button
              variant="outlined"
              onClick={() => setCustomOpen(!customOpen)}
              startIcon={customOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
            >Custom HTML</Button>
            <Collapse in={customOpen} timeout="auto" unmountOnExit>
              <p className={classes.info}>If you want a custom icon, insert valid HTML (and inlined css)
                below</p>
              <TextField
                className={classes.htmlField}
                label="Insert your custom HTML here"
                multiline
                rows={2}
                maxRows={8}
                variant="outlined"
                defaultValue={html}
                onChange={(e) => setHtml(e.target.value)}
              />
              <div>
                <Paper className={classes.previewPaper}>
                  <div className={classes.icon}>
                    <PageIcon icon={html}/>
                  </div>
                </Paper>
                <Button
                  size="small"
                  className={classes.saveButton}
                  disabled={!html?.trim() || html === initialIcon}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpen(false)
                    onSubmit(html)
                  }}
                >Save HTML</Button>
              </div>
            </Collapse>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

interface SelectableIconProps {
  icon: string
  onSelect: () => any
}

function SeletableIcon({ icon, onSelect }: SelectableIconProps) {

  const classes = useStyles()

  return (
    <div className={classes.iconDiv}>
      <div className={classes.icon}>
        <PageIcon icon={icon}/>
      </div>
      <Button
        className={classes.selectButton}
        variant="contained"
        size="small"
        onClick={onSelect}
      >Select</Button>
    </div>
  )
}
