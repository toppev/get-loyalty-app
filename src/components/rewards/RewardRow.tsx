import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import React, { useContext } from 'react';
import Reward from './Reward';
import RewardContext from './RewardContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rowDiv: {
            backgroundColor: 'ghostwhite',
            marginBottom: '5px',
            padding: '5px 25px 5px 0px'
        },
        icon: {
            marginLeft: '8px'
        },
        itemName: {
            margin: '5px',
        },
        noMobile: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        button: {
            margin: '10px 5px 5px 0px',
            width: '75px'
        },
    }));

interface RewardRowProps {
    reward: Reward,
    CustomActions?: JSX.Element
    startEditing?: (reward: Reward) => any
}

export default function (props: RewardRowProps) {

    const classes = useStyles();

    const { CustomActions, reward } = props;

    return (
        <div className={classes.rowDiv}>

            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={1} sm={1}>
                    <FastfoodIcon className={classes.icon} />
                </Grid>
                <Grid item xs={2} sm={2}>
                    <b>{reward.name}</b>
                </Grid>
                <Grid item sm={3} className={classes.noMobile}>
                    {reward.description}
                </Grid>
                <Grid item xs={1} sm={1}>
                    {reward.itemDiscount}
                </Grid>
                <Grid item xs={1} sm={1}>
                    {reward.customerPoints && (<p>{reward.customerPoints} points</p>)}
                </Grid>
                <Grid item xs={2} sm={2} className={classes.noMobile}>
                    {reward.products.map(p => p.name).join(", ")}
                </Grid>
                <Grid item xs={2} sm={2}>
                    {CustomActions || <SelectAction {...props} />}
                </Grid>
            </Grid>

        </div>
    )
}

function SelectAction(props: RewardRowProps) {

    const classes = useStyles();

    const context = useContext(RewardContext);


    return (
        <>
            <Button
                className={classes.button}
                startIcon={(<EditIcon />)}
                onClick={() => {
                    if (props.startEditing) {
                        props.startEditing(props.reward);
                    }
                }}
                variant="contained"
                color="primary"
            >Select</Button>
        </>
    )

}