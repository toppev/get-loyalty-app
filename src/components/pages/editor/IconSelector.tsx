import React, { useState } from "react";
import CloseButton from "../../common/button/CloseButton";
import { Button, createStyles, Dialog, Grid, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SVGIcons from "./SVGIcons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {},
        selectButton: {},
        iconDiv: {
            margin: '7px',
            textAlign: 'center'
        }
    }));

interface IconSelectorProps {
    /**
     * When user selects an icon. Returns HTML
     */
    onSubmit: (icon: string) => any
}

export default function (props: IconSelectorProps) {
    const { onSubmit } = props;

    const [open, setOpen] = useState(false);
    const [icons, setIcons] = useState<string[]>(SVGIcons);

    return (
        <div>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
            >View Icons</Button>
            <Dialog open={open} fullWidth>
                <CloseButton onClick={() => setOpen(false)}/>
                <Grid container>
                    {icons.map((icon) => (
                        <Grid item xs={4}>
                            <Icon icon={icon} onSelect={() => onSubmit(icon)}/>
                        </Grid>
                    ))}
                </Grid>
            </Dialog>
        </div>
    )
}

interface IconProps {
    icon: string
    onSelect: () => any
}

function Icon({ icon, onSelect }: IconProps) {

    const classes = useStyles();

    return (
        <div className={classes.iconDiv}>
            <p dangerouslySetInnerHTML={{ __html: icon }} className={classes.icon}/>
            <Button
                className={classes.selectButton}
                variant="contained"
                size="small"
                onClick={onSelect}
            >Select</Button>
        </div>
    )
}