import { Box, Button, createStyles, Divider, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Campaign } from "./Campaign";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import RewardItem from "../rewards/RewardItem";
import { plural } from "../common/StringUtils";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            width: '100%',
            padding: '10px',
            margin: '10px',
        },
        description: {
            textAlign: 'center',
            color: theme.palette.grey[600],
            fontSize: '16px'
        },
        couponCode: {
            color: theme.palette.secondary.main,
        },
        typography: {},
        boxDesktop: {},
        boxItem: {
            flex: '1 1 0px'
        }
    }));


const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(from: Date, to: Date): number {
    const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

interface CampaignPaperProps {
    campaign: Campaign
    showRewards?: boolean
}

export default function (props: CampaignPaperProps) {

    const { campaign } = props;
    const { start, end } = campaign;

    // days from/till campaign start and end
    const diffString = (date?: Date) => {
        if (date) {
            const toDate = dateDiffInDays(new Date(), date)
            return toDate < 0 ? `${toDate} days ago` : `in ${toDate} ${plural("day", toDate)}`
        }
        return ""
    }
    const toStartStr = diffString(start)
    const toEndStr = diffString(end)

    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Typography className={classes.typography} variant="h5" align="center">
                {campaign.name}
            </Typography>

            <p className={classes.description}>{campaign.description}</p>

            <Divider/>

            <Box display="flex" flexWrap="none" flexDirection="row" p={1} m={1} className={classes.boxDesktop}>
                <Box className={classes.boxItem}>
                    {campaign.requirements.length !== 0 && (
                        <>
                            <b>Campaign
                                Type</b> ({`${campaign.requirements.length} ${plural("trait", campaign.requirements)}`})
                            <ul>
                                {campaign.requirements.map(req => (
                                    <li key={req.type}>
                                        <b>{req.type}</b>
                                        <p>Question: <i>{req.question}</i></p>
                                        {req.values.length !== 0 &&
                                        <p>{plural("Value", req.values)}: {req.values.join(', ')}</p>}
                                    </li>
                                ))}
                            </ul>
                        </>)
                    }
                    <br/>
                    <p>Starts: {start?.toDateString()} ({toStartStr})</p>
                    <p>Ends: {end?.toDateString()} ({toEndStr})</p>
                    <br/>
                    <p>
                        Rewarded: <b>{campaign.rewardedCount}/{campaign.maxRewards.total || 'unlimited'}</b>
                        <br/>
                        (Max rewards per user: {campaign.maxRewards.user})
                    </p>
                    <br/>
                    <p>Coupon Code: <span className={classes.couponCode}>{campaign.couponCode}</span></p>
                    <br/>
                    <p>Per purchase points: <b>{campaign.transactionPoints}</b> (?)</p>

                </Box>
                <Box className={classes.boxItem}>
                    <RenderList
                        list={campaign.endReward}
                        title="End Rewards:"
                        renderer={item => <RewardItem reward={item}/>}
                    />
                    <RenderList
                        list={campaign.categories}
                        title="Categories:"
                        renderer={item => <p>{item.toString()}</p>}
                    />
                    <RenderList
                        list={campaign.products}
                        title="Products:"
                        renderer={item => <p>{item.toString()}</p>}
                    />
                </Box>
            </Box>
        </Paper>
    )
}

interface RenderListProps<T> {
    title?: string
    list: T[],
    renderer: (item: T) => JSX.Element
    showRewards?: boolean
}

/**
 * Render the given list with a toggle button
 */
function RenderList(props: RenderListProps<any>) {


    const [showRewards, setShowRewards] = useState(props.showRewards || false);

    const { list, title, renderer } = props;

    return (
        <div>
            <p>
                {title} <b>{(list.length || "all") + " "}</b>
                {list.length !== 0 && (
                    <Button
                        onClick={() => {
                            setShowRewards(!showRewards)
                        }}
                        color="primary"
                        size="small"
                        variant="text"
                        endIcon={showRewards ? (<VisibilityOffIcon/>) : (<VisibilityIcon/>)}
                    >View</Button>
                )}
            </p>
            {showRewards && list.map(item => renderer(item))}
        </div>
    )
}