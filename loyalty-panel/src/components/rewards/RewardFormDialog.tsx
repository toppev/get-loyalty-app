import { Dialog, DialogContent } from "@material-ui/core";
import React from "react";
import RewardForm, { RewardFormProps } from "./RewardForm";
import CloseButton from "../common/button/CloseButton";


export interface RewardFormDialogProps extends RewardFormProps {
  open: boolean,
  onClose: (event: React.MouseEvent<HTMLElement>) => void,
}

export default function (props: RewardFormDialogProps) {

  return (
    <div>
      <Dialog open={props.open}>
        <CloseButton onClick={props.onClose}/>
        <DialogContent>
          <RewardForm {...props} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
