import { patch } from "../config/axios";
import { AppContext } from "../AppContext";
import { useContext } from "react";

const getUserForm = () => document.querySelector(`#user-form`)
const getEmailField = () => document.getElementById("user-email");
const getBirthdayField = () => document.getElementById("birthday-selector");
const getSubmitBtn = () => document.querySelector(`#user-form-submit`)

export function useUserFormInitialValues() {
    const { user } = useContext(AppContext)
    if (!user) return

    // Handle default values

    const ef = getEmailField()
    if (ef) ef.value = user.email || ""

    if (user.birthday) {
        const bd = new Date(Date.parse(user.birthday)).toISOString()
        const bf = getBirthdayField()
        // e.g 1999-02-16
        if (bf) bf.value = bd.slice(0, 10)
        // Disable birthday field to prevent abuse
        bf.disabled = true
    }

    // Handle form submission
    const form = getUserForm()
    if (form) {
        form.onsubmit = e => {
            e.preventDefault()
            if (form?.reportValidity() !== false) {
                submitChanges()
            }
        }
    }
}

function submitChanges() {
    const submitBtn = getSubmitBtn()
    submitBtn.disabled = true

    patch('/user', {
        email: getEmailField().value,
        birthday: new Date(getBirthdayField().value),
        acceptAll: true,
    }).catch(err => {
        submitBtn.disabled = false

        const msg = err.response?.data?.message
        if (msg) {
            // FIXME: show the error somewhere else
            window.alert(msg)
        }
    })
}