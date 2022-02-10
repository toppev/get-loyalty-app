import React, { useState } from "react"
import { Button, Collapse } from "@mui/material"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import VisibilityIcon from "@mui/icons-material/Visibility"

interface RenderListProps<T> {
  title?: string
  list: T[],
  renderAll: (item: T[]) => (JSX.Element | JSX.Element[])
  show?: boolean
  /**
   * String to display if the list is empty.
   * By default "all".
   */
  emptyString?: string
}

/**
 * Render the given list with a toggle button
 */
export function RenderList(props: RenderListProps<any>) {

  const [show, setShow] = useState(props.show || false)
  const { list, title, renderAll } = props

  return (
    <div>
      <p>
        <b>{title}</b> {(list.length || props.emptyString || "all")}
        {list.length !== 0 && (
          <Button
            onClick={() => {
              setShow(!show)
            }}
            color="primary"
            size="small"
            variant="text"
            endIcon={show ? (<VisibilityOffIcon/>) : (<VisibilityIcon/>)}
          >View</Button>
        )}
      </p>
      <Collapse in={show} timeout="auto" unmountOnExit>
        {renderAll(list)}
      </Collapse>
    </div>
  )
}
