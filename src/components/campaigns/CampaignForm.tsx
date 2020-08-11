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
import Reward from "../rewards/Reward";
import DateFnsUtils from "@date-io/date-fns";
import SelectProductsButton from "../products/button/SelectProductsButton";
import RequirementSelector from "./RequirementSelector";
import useRequest from "../../hooks/useRequest";
import RetryButton from "../common/button/RetryButton";
import { createCampaign, updateCampaign } from "../../services/campaignService";
import { isAlphanumeric } from "../../util/Validate";
import RewardManager from "../rewards/RewardManager";

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

const emptyCampaign = new Campaign({ id: "new_campaign", name: "", description: "" })

export default function ({ initialCampaign, onSubmitted }: CampaignFormProps) {

    const classes = useStyles();

    const campaign = initialCampaign || emptyCampaign;
    // not formik fields so keep track of them here
    const [categories, setCategories] = useState(campaign.categories);
    const [products, setProducts] = useState(campaign.products);
    const [endRewards, setEndRewards] = useState<Reward[]>(campaign.endReward);
    const [requirements, setRequirements] = useState<Requirement[]>([]);

    const [isDates, setIsDates] = useState<boolean>(!!campaign.start || !!campaign.end);
    const [startDate, setStartDate] = useState<Date | undefined>(campaign.start);
    const [endDate, setEndDate] = useState<Date | undefined>(campaign.end);

    const { error, loading, response, performRequest } = useRequest();

    const [productSelectorOpen, setProductSelectorOpen] = useState(false);

    const isEditing = !!initialCampaign;
    const title = isEditing ? 'Edit Campaign' : 'Create Campaign';

    const mergeCampaign = (campaign: Campaign) => {
        // Update categories and other stuff here
        Object.assign(campaign, { categories, products, endReward: endRewards, requirements })
        if (isDates) {
            campaign.start = startDate;
            campaign.end = endDate;
        } else {
            campaign.start = undefined;
            campaign.end = undefined;
        }
        return campaign
    }

    return (
        <div className={classes.paper}>
            <Typography color="primary" component="h1" variant="h4">{title}</Typography>
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
                                          label="Temporary campaign (ends automatically)"/>
                        <FormControlLabel value="false" control={<Radio/>} checked={!isDates}
                                          label="Continuous (no end date)"/>
                    </RadioGroup>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            label="Campaign start date (dd/MM/yyyy)"
                            format="dd/MM/yyyy"
                            value={startDate}
                            onChange={(date, value) => date && setStartDate(date)}
                        />
                        <KeyboardDatePicker
                            disabled={!isDates}
                            disablePast={!campaign.end}
                            margin="normal"
                            label="Campaign end date (dd/MM/yyyy)"
                            format="dd/MM/yyyy"
                            value={endDate}
                            onChange={(date, value) => date && setEndDate(date)}
                        />
                    </MuiPickersUtilsProvider>

                    <Typography variant="h6" className={classes.typography}>Campaign Type(s)</Typography>
                    <p className={classes.tip}>Specify when this campaign is valid. In other words, select requirements
                        for this campaign</p>
                    <RequirementSelector initialRequirements={requirements} onChange={setRequirements}/>

                    <Typography variant="h6" className={classes.typography}>End Rewards</Typography>

                    <RewardManager rewards={endRewards} setRewards={setEndRewards}/>

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
                    </div>

                    {error && <RetryButton error={error}/>}

                    <div className={classes.submitDiv}>
                        <Button
                            className={classes.submitButton}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={(<SaveIcon/>)}
                            onClick={submitForm}
                        >Save</Button>
                        {loading && <LinearProgress/>}
                    </div>

                    <IdText id={campaign.id}/>
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
    /*
    // FIXME: does not work
    if (values.maxRewards?.user && values.maxRewards.user < 1) {
        errors.maxRewards!!.user = 'Max rewards per user can not be less than 1.';
    }
    if (values.maxRewards?.total && values.maxRewards.total < 0) {
        errors.maxRewards!!.total = 'Max (total) rewards can not be less than 0.';
    }
    */
    if (values.transactionPoints && values.transactionPoints < 0) {
        errors.transactionPoints = 'Points per purchase can not be negative.'
    }
    if (values.couponCode && !isAlphanumeric(values.couponCode)) {
        errors.couponCode = 'The code must be alphanumeric. Allowed characters: numbers, letters (a-z or A-Z), underscore ("_") and hyphen ("-").'
    }
    return errors;
}