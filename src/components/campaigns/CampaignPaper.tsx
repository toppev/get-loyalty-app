import { Button, createStyles, Divider, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import React from "react";
import { Campaign } from "./Campaign";
import RewardItem from "../rewards/RewardItem";
import { plural } from "../common/StringUtils";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { RenderList } from "../common/RenderList";
import allRequirements from "@toppev/loyalty-campaigns";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: '15px',
            minHeight: '600px'
        },
        description: {
            textAlign: 'center',
            color: theme.palette.grey[700],
            fontSize: '16px',
            height: '30px',
            wordBreak: 'break-word',
            overflow: 'overlay',
            marginBlockStart: '0.5em',
            marginBlockEnd: '0.1em',
        },
        couponCode: {
            color: theme.palette.secondary.main,
            textTransform: 'uppercase'
        },
        typography: {},
        boxDesktop: {},
        boxItem: {
            flex: '1 1 0px'
        },
        detail: {
            color: theme.palette.grey[600]
        },
        helpIcon: {
            marginLeft: '20px'
        },
        buttonsDiv: {
            textAlign: 'center'
        },
        button: {
            margin: '15px 12px 0px 12px'
        }
    }));


const MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(from: Date, to: Date): number {
    const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

interface CampaignPaperProps {
    campaign: Campaign
    startEditing: () => any
    deleteCampaign: () => any
    showRewards?: boolean
}

export default function (props: CampaignPaperProps) {

    const classes = useStyles();

    const { campaign } = props;
    const { start, end, requirements, maxRewards, endReward, categories, products } = campaign;

    // Days from/till campaign start/end date
    const diffString = (date?: Date) => {
        if (date) {
            const toDate = dateDiffInDays(new Date(), date)
            if (toDate === 0) return '(today)'
            if (toDate === -1) return '(yesterday)'
            if (toDate === 1) return '(tomorrow)'
            return `(${toDate < 0 ? `${-toDate} days ago` : `in ${toDate} ${plural("day", toDate)}`})`
        }
        return ""
    }
    const toStartStr = diffString(start)
    const toEndStr = diffString(end)

    return (
        <Paper className={classes.paper}>
            <Typography className={classes.typography} variant="h5" align="center">
                {campaign.name}
            </Typography>
            <p className={classes.description}>{campaign.description}</p>
            <Divider style={{ marginBottom: '6px' }}/>
            {requirements.length !== 0 && (
                <>
                    <b>{plural("Campaign Type", requirements)}</b> ({`${requirements.length} ${plural("trait", requirements)}`})
                    <ul>
                        {requirements.map(req => (
                            <li key={req.type}>
                                <b>{req.type}</b>
                                {req.question && <p>Question: <i>{req.question}</i></p>}
                                {req.values.length !== 0 &&
                                <div>
                                    {req.values.map((val, index) => {
                                            const valueTypes = allRequirements[req.type].valueDescriptions || []
                                            return (
                                                <p key={val}>{valueTypes[index]?.name || 'unknown'}: <b>{val}</b></p>
                                            )
                                        }
                                    )}
                                </div>}
                            </li>
                        ))}
                    </ul>
                </>)
            }
            <br/>
            <p>
                Start: {start?.toDateString()} <span className={classes.detail}>{toStartStr}</span>
            </p>
            <p>
                End: {end?.toDateString() || <i>not specified</i>} <span className={classes.detail}>{toEndStr}</span>
            </p>
            <br/>
            <p>
                Rewarded: <b>{campaign.rewardedCount || 0}/{maxRewards.total || 'unlimited'}</b>
                <br/>
                <span className={classes.detail}>
                    (max <b>{maxRewards.user}</b> {plural('reward', maxRewards.user)} per user)
                </span>
            </p>
            <br/>
            <p>Per purchase points: <b>{campaign.transactionPoints}</b>
                <Tooltip
                    enterDelay={200}
                    leaveDelay={300}
                    title={
                        <React.Fragment>
                            <Typography>Transaction/purchase points</Typography>
                            Points the customer earns every time they make a purchase that is compliant with this
                            campaign
                        </React.Fragment>
                    }
                >
                    <HelpOutlineIcon fontSize="small" className={classes.helpIcon}/>
                </Tooltip>
            </p>
            <p style={{ visibility: campaign.couponCode?.length ? 'visible' : 'hidden' }}>
                Coupon Code: <span className={classes.couponCode}>{campaign.couponCode}</span>
            </p>
            <br/>
            <div>
                <RenderList
                    list={endReward}
                    title="End Rewards:"
                    emptyString="none"
                    renderAll={items => items.map(item => <RewardItem key={item.id} reward={item}/>)}
                />
                <RenderList
                    list={categories}
                    title="Categories:"
                    renderAll={items => (
                        <ul>
                            {items.map(item => <li key={item.id}>{item.name?.toString()}</li>)}
                        </ul>
                    )}
                />
                <RenderList
                    list={products}
                    title="Products:"
                    renderAll={items => (
                        <ul>
                            {items.map(item => <li key={item.id}>{item.name?.toString()}</li>)}
                        </ul>
                    )}
                />
            </div>
            <div className={classes.buttonsDiv}>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={props.startEditing}
                >Edit</Button>

                <Button
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        if (window.confirm('Do you want to delete this campaign? This action is irreversible.')) {
                            props.deleteCampaign()
                        }
                    }}
                >Delete</Button>
            </div>
        </Paper>
    )
}
