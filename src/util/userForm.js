import { patch } from "../config/axios";
import { AppContext } from "../AppContext";
import { useContext } from "react";

const submitId = "user-form-submit"

/** Initialize user form submission script */
export function initUserFormScript() {
    window.onclick = e => {
        if (e.target?.id === submitId) {
            e.preventDefault();
            submitChanges();
        }
    }
}

const getEmailField = () => document.getElementById("user-email");
const getBirthdayField = () => document.getElementById("birthday-selector");

/** Makes sure email and birthday fields have their default values */
export function useUserFormInitialValues() {
    const { user } = useContext(AppContext);
    if(!user) return

    getEmailField().value = user.email || "";

    if (user.birthday) {
        const bd = new Date(Date.parse(user.birthday)).toISOString()
        getBirthdayField().value = bd.slice(0, 10);
    }
}

function submitChanges() {
    const submitBtn = document.querySelector(`#${submitId}`)
    submitBtn.disabled = true;
    patch('/user', {
        email: getEmailField().value,
        birthday: new Date(getBirthdayField().value),
        acceptAll: true,
    }).finally(() => {
        submitBtn.disabled = false;
    });
}