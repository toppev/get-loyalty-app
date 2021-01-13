import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { useContext, useState } from "react";
import AppContext, { Business, CustomerLevel } from "../../../context/AppContext";
import CustomerLevelForm from "./CustomerLevelForm";
import CustomerLevelItem from "./CustomerLevelItem";
import useRequest from "../../../hooks/useRequest";
import { updateBusiness } from "../../../services/businessService";
import NewButton from "../../common/button/NewButton";
import RetryButton from "../../common/button/RetryButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newBtn: {},
    }));


export default function () {

    const [editing, setEditing] = useState<CustomerLevel | undefined>();

    const context = useContext(AppContext);
    const classes = useStyles();

    const request = useRequest()

    const submitUpdate = (business: Business, setSubmitting: (b: boolean) => any) => {
        request.performRequest(
            () => updateBusiness(business),
            (res) => {
                context.setBusiness(res.data);
                setSubmitting(false);
                setEditing(undefined)
            },
            () => setSubmitting(false)
        );
    }

    const orderedLevels = [...context.business.public.customerLevels].sort((a, b) => {
        return (a.requiredPoints || 0) - (b.requiredPoints || 0)
    })

    return (
        <div>
            <NewButton
                name="New Level"
                buttonProps={{
                    className: classes.newBtn,
                    onClick: () => setEditing({ name: "", rewards: [] })
                }}
            />
            <Box display="flex" flexWrap="wrap">
                {orderedLevels.map(level => (
                        <div key={level._id || 'new_level'}>
                            <CustomerLevelItem
                                level={level}
                                startEditing={() => setEditing(level)}
                                onDelete={() => {
                                    if (window.confirm(`Are you sure you want to delete the "${level.name}" customer level?`)) {
                                        const business = { ...context.business }
                                        business.public.customerLevels = business.public.customerLevels.filter(it => it._id !== level._id)
                                        submitUpdate(business, (b) => b)
                                    }
                                }}/>
                        </div>
                    )
                )}
                <RetryButton error={request.error}/>
            </Box>

            {!!editing &&
            <CustomerLevelForm
                open={true}
                onClose={() => setEditing(undefined)}
                initialLevel={editing}
                currentLevels={orderedLevels}
                onSubmit={(level, setSubmitting) => {
                    const business = { ...context.business }
                    business.public.customerLevels = [...business.public.customerLevels.filter(it => it._id !== level._id), level]
                    submitUpdate(business, setSubmitting)
                    setEditing(undefined)
                }}
            />}
        </div>
    )
}