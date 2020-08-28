import { patch } from "../config/axios";
import { AppContext } from "../AppContext";
import { useContext } from "react";

const submitId = "user-form-submit"

const getUserForm = () => document.querySelector(`#user-form`)
const getEmailField = () => document.getElementById("user-email");
const getBirthdayField = () => document.getElementById("birthday-selector");
const getSubmitBtn = () => document.querySelector(`#${submitId}`)

/** Makes sure email and birthday fields have their default values */
export function useUserFormInitialValues() {
    const { user } = useContext(AppContext);
    if (!user) return

    const ef = getEmailField()
    if (ef) ef.value = user.email || "";

    if (user.birthday) {
        const bd = new Date(Date.parse(user.birthday)).toISOString()
        const bf = getBirthdayField()
        if (bf) bf.value = bd.slice(0, 10);
    }

    const form = getUserForm()
    form && form.addEventListener("onsubmit", e => {
        e.preventDefault();
        submitChanges();
    })
}

function submitChanges() {
    const submitBtn = getSubmitBtn()
    submitBtn.disabled = true;

    patch('/user', {
        email: getEmailField().value,
        birthday: new Date(getBirthdayField().value),
        acceptAll: true,
    }).finally(() => {
        submitBtn.disabled = false;
    });
}