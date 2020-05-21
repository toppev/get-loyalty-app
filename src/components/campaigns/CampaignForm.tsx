import { Campaign, Requirement } from "./Campaign";
import React, { useState } from "react";
import {
    Button,
    createStyles,
    FormControlLabel,
    LinearProgress,
    makeStyles,
    Radio,
    RadioGroup,
    Theme,
    Typography
} from "@material-ui/core";
import { Form, Formik, FormikErrors } from "formik";
import { TextField } from "formik-material-ui";
import CategorySelector from "../categories/CategorySelector";
import ProductSelector from "../products/ProductSelector";
import SaveIcon from "@material-ui/icons/Save";
import IdText from "../common/IdText";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import RewardItem, { RemoveEditRewardActions } from "../rewards/RewardItem";
import Reward from "../rewards/Reward";
import RewardFormDialog from "../rewards/RewardFormDialog";
import DateFnsUtils from "@date-io/date-fns";
import RewardSelector from "../rewards/RewardSelector";
import SelectProductsButton from "../products/button/SelectProductsButton";
import RequirementSelector from "./RequirementSelector";
import useRequest from "../../hooks/useRequest";
import RetryButton from "../common/button/RetryButton";
import { createCampaign, updateCampaign } from "../../services/campaignService";
import { alphanumeric } from "../../util/Validate";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        field: {
            width: '100%',
            margin: '12px 0px'
        },
        submitDiv: {
            margin: '5px',
            textAlign: 'center',
        },
        submitButton: {
            margin: theme.spacing(3, 0, 2),
        },
        typography: {
            margin: '40px 0px 8px 0px',
            color: theme.palette.grey[700]
        },
        tip: {
            color: theme.palette.grey[500]
        },
        catProdDiv: {
            marginTop: '50px'
        },
        newRewardBtn: {},
    }));


export interface CampaignFormProps {
    initialCampaign?: Campaign,
    onSubmitted: (campaign: Campaign) => any

}

const emptyCampaign = new Campaign("new_campaign", "", "")

export default function ({ initialCampaign, onSubmitted }: CampaignFormProps) {

    const classes = useStyles();

    const campaign = initialCampaign || emptyCampaign;
    // not formik fields so keep track of them here
    const [categories, setCategories] = useState(campaign.categories);
    const [products, setProducts] = useState(campaign.products);
    const [endRewards, setEndRewards] = useState<Reward[]>(campaign.endReward);
    const [requirements, setRequirements] = useState<Requirement[]>([]);

    const [isDates, setIsDates] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const { error, loading, response, performRequest } = useRequest();

    const [rewardSelectorOpen, setRewardSelectorOpen] = useState(false);
    // The reward being edited currently (if any)
    const [editReward, setEditReward] = useState<Reward | undefined>();

    const [productSelectorOpen, setProductSelectorOpen] = useState(false);

    const isEditing = !!initialCampaign;
    const title = isEditing ? 'Edit Campaign' : 'Create Campaign';

    const mergeCampaign = (campaign: Campaign) => {
        // Update categories and other stuff here
        Object.assign(campaign, { categories, products, endRewards, requirements })
        if (isDates) {
            campaign.start = startDate;
            campaign.end = endDate;
        } else {
            campaign.start = undefined;
            campaign.end = undefined;
        }
    }

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h4">{title}</Typography>
            <Formik
                initialValues={campaign}
                validate={validate}
                onSubmit={(campaign, actions) => {
                    mergeCampaign(campaign)
                    performRequest(
                        () => isEditing ? updateCampaign(campaign) : createCampaign(campaign),
                        () => {
                            actions.setSubmitting(false)
                            onSubmitted(campaign)
                        }
                    )
                }}
            >{({ submitForm, isSubmitting }) => (
                <Form className={classes.form}>
                    <TextField
                        className={classes.field}
                        name="name"
                        type="text"
                        label="Name of this campaign"
                        placeholder="Birthday cake!"
                    />
                    <TextField
                        className={classes.field}
                        name="description"
                        type="text"
                        label="Description of this campaign"
                        placeholder="Free cupcake on your birthday!"
                    />
                    <TextField
                        className={classes.field}
                        name="transactionPoints"
                        type="number"
                        label="Transaction Points"
                        placeholder="Customer points to receive per purchase"
                    />
                    <TextField
                        className={classes.field}
                        name="maxRewards.total"
                        type="number"
                        label="Total number of rewards"
                        placeholder="Maximum number of rewards to give"
                    />
                    <TextField
                        className={classes.field}
                        name="maxRewards.user"
                        type="number"
                        label="Rewards per user"
                        placeholder="Maximum number of rewards per user"
                    />
                    <TextField
                        className={classes.field}
                        name="couponCode"
                        type="text"
                        label="Coupon code (customers can use to gain rewards)"
                        placeholder="e.g SUMMER2020, STUDENT20 or name of an event"
                    />

                    <Typography variant="h6" className={classes.typography}>Duration & Dates</Typography>
                    <RadioGroup name="Dates" value={isDates} onChange={(e, val) => setIsDates(val === "true")}>
                        <FormControlLabel value="true" control={<Radio/>} checked={isDates}
                                          label="Temporary campaign (start and end dates)"/>
                        <FormControlLabel value="false" control={<Radio/>} checked={!isDates}
                                          label="Continuous (no start or end dates)"/>
                    </RadioGroup>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disabled={!isDates}
                            disablePast
                            margin="normal"
                            label="Campaign start date (dd/MM/yyyy)"
                            format="dd/MM/yyyy"
                            value={startDate}
                            onChange={(date, value) => date && setStartDate(date)}
                        />
                        <KeyboardDatePicker
                            disabled={!isDates}
                            disablePast
                            margin="normal"
                            label="Campaign end date (dd/MM/yyyy)"
                            format="dd/MM/yyyy"
                            value={endDate}
                            onChange={(date, value) => date && setEndDate(date)}
                        />
                    </MuiPickersUtilsProvider>

                    <Typography variant="h6" className={classes.typography}>Campaign Type(s)</Typography>
                    <RequirementSelector onChange={setRequirements}/>

                    <Typography variant="h6" className={classes.typography}>End Rewards</Typography>
                    <div>
                        {endRewards.map(reward => (
                            <RewardItem
                                reward={reward}
                                actions={(
                                    <RemoveEditRewardActions
                                        onEdit={() => setEditReward(reward)}
                                        onRemove={() => {
                                            if (window.confirm('Confirm removing a reward from this campaign. ' +
                                                'This does not affect customers who were previously rewarded.')) {
                                                setEndRewards(endRewards.filter(r => r._id !== reward._id))
                                            }
                                        }}
                                    />
                                )}
                            />
                        ))}
                        <RewardFormDialog
                            open={!!editReward}
                            initialReward={editReward}
                            onClose={() => setEditReward(undefined)}
                            onSubmitted={reward => {
                                setEditReward(undefined);
                                setEndRewards(endRewards.map(r => r._id === reward._id ? reward : r))
                            }}
                        />
                        <Button
                            className={classes.newRewardBtn}
                            variant="contained"
                            startIcon={(<AddIcon/>)}
                            onClick={() => setRewardSelectorOpen(true)}
                        >Add Reward</Button>
                    </div>

                    <div className={classes.catProdDiv}>
                        <p className={classes.tip}>
                            (Optional) Select which categories or products are included in the campaign.
                            <br/>
                            <b>Leave empty for all categories and products.</b>
                        </p>
                        <CategorySelector
                            className={classes.field}
                            initialCategories={campaign.categories}
                            onCategoriesUpdate={setCategories}
                        />
                        <SelectProductsButton
                            products={products}
                            buttonProps={{
                                disabled: isSubmitting,
                                onClick: () => setProductSelectorOpen(true)
                            }}
                        />
                        <ProductSelector
                            open={productSelectorOpen}
                            onClickClose={() => setProductSelectorOpen(false)}
                            onSubmit={products => {
                                setProducts(products)
                                setProductSelectorOpen(false)
                            }}
                            text="Select products that are included in the campaign"
                        />
                        <RewardSelector
                            open={rewardSelectorOpen}
                            onClose={() => setRewardSelectorOpen(false)}
                            onSelect={reward => setEndRewards([...endRewards, reward])}
                        />
                    </div>

                    {error && <RetryButton error={error}/>}

                    <div className={classes.submitDiv}>
                        <Button
                            className={classes.submitButton}
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            startIcon={(<SaveIcon/>)}
                            onClick={submitForm}
                        >Save</Button>
                        {(isSubmitting || loading) && <LinearProgress/>}
                    </div>

                    <IdText id={campaign._id}/>
                </Form>
            )}
            </Formik>
        </div>
    )
}

function validate(values: Campaign): FormikErrors<Campaign> {
    const errors: FormikErrors<Campaign> = {};
    if (!values.name.trim().length) {
        errors.name = 'Name can not be empty.'
    }
    if (values.maxRewards?.user && values.maxRewards.user < 1) {
        errors.maxRewards!!.user = 'Max rewards per user can not be less than 1.';
    }
    if (values.maxRewards?.total && values.maxRewards.total < 0) {
        errors.maxRewards!!.total = 'Max (total) rewards can not be less than 0.';
    }
    if (values.transactionPoints && values.transactionPoints < 0) {
        errors.transactionPoints = 'Points per purchase can not be negative.'
    }
    if (values.couponCode && !alphanumeric(values.couponCode)) {
        errors.couponCode = 'The code must be alphanumeric. Allowed characters: numbers, letters (a-z or A-Z), underscore ("_") and hyphen ("-").'
    }
    return errors;
}