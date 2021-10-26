import { Card, CardActions, CardContent, CardProps, IconButton, TextField, Tooltip, Typography } from "@material-ui/core"
import { Page } from "./Page"
import React, { useState } from "react"
import { backendURL, post } from "../../config/axios"
import EditIcon from "@material-ui/icons/Edit"
import IdText from "../common/IdText"
import { usePageStyles } from "./PagesPage"

interface PageCardProps extends CardProps {
  page: Page
  editableName?: boolean
  actions?: React.ReactNode
  displayId?: boolean
  displayStage?: boolean
  image?: string
}

export default function PageCard(props: PageCardProps) {

  const { editableName, page, actions, displayId = true, displayStage = true, image, ...otherProps } = props

  const classes = usePageStyles()

  const [editing, setEditing] = useState(false)

  const submitNameChange = () => {
    setEditing(false)
    const url = `${backendURL}/page/${page._id}`
    post(url, { name: page.name }, true)
      .catch(err => {
        // Show notification?
        console.log(`Failed to rename page: ${err}`)
      })
  }

  const backgroundImageCss = image ? {
    backgroundImage: `url(${image})`,
  } : {}

  return (
    <Card className={classes.card} {...otherProps}>
      <div className={classes.cardContentDiv}>
        <div className={classes.backgroundImage} style={backgroundImageCss}/>
        <CardContent className={`${classes.cardContent} ${classes.center}`}>
          <TextField
            disabled={!editing}
            className={classes.pageNameField}
            defaultValue={page.name}
            margin="dense"
            name="name"
            type="text"
            inputProps={{ min: 0, style: { textAlign: 'center', color: '#292929' } }}
            InputProps={{
              className: classes.pageName,
              disableUnderline: !editing,
              endAdornment: editableName ? (
                <Tooltip
                  enterDelay={750}
                  leaveDelay={100}
                  title={
                    <React.Fragment>
                      <Typography>{`Rename`}</Typography>
                      The name of the page is not shown to customers.
                    </React.Fragment>
                  }
                >
                  <div>
                    <IconButton
                      className={classes.editPageNameBtn}
                      onClick={() => editing ? submitNameChange() : setEditing(true)}
                    >
                      <EditIcon/>
                    </IconButton>
                  </div>
                </Tooltip>
              ) : null,
            }}
            onChange={(e) => page.name = e.target.value}
            onBlur={() => submitNameChange()}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault()
                submitNameChange()
              }
            }}
          />
          <br/>
          <span className={classes.pageDesc}>{page.description}</span>
        </CardContent>
      </div>
      <CardActions className={`${classes.cardActions} hoverable`}>
        {<p style={{ color: 'grey' }}>{page.template ? "Template page" : ""}</p>}
        {displayStage &&
        <Typography variant="h6">
          Stage:
          <span className={page.isPublished() ? classes.published : classes.unpublished}> {page.stage}</span>
        </Typography>}
        {actions}
        {displayId && <IdText id={page._id}/>}
      </CardActions>
    </Card>
  )
}
