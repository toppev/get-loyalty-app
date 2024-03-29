import client from "../config/axios"
import { AppContext } from "../AppContext"
import { useContext } from "react"

const getUserForm = () => document.getElementById(`user-form`)

const getEmailField = () => document.getElementById("user-email")
const getBirthdayField = () => document.getElementById("birthday-selector")
const getNewsLetterCheckbox = () => document.getElementById("user-form-newsletter")

export function useUserFormInitialValues() {
  const context = useContext(AppContext)
  const { user } = context
  if (!user) return

  // FIXME: just a temp fix
  setTimeout(() => {
    // Handle default values
    const ef = getEmailField()
    if (ef) ef.value = user.email || ""

    if (user.birthday) {
      const bd = new Date(Date.parse(user.birthday)).toISOString()
      const bf = getBirthdayField()
      // e.g 1999-02-16
      if (bf) {
        bf.value = bd.slice(0, 10)
        // Disable birthday field to prevent changing it again
        bf.disabled = true
      }
    }

    // Handle form submission
    const form = getUserForm()
    if (form) {
      form.onsubmit = e => {
        e.preventDefault()
        if (form?.reportValidity() !== false) {
          if (user.businessOwner) {
            window.alert("Your email would have been updated but because you're the owner of this business" +
              " it would cause problems.\n\nUpdate your email: panel.getloyalty.app/account")
            toggleForm(true)
          } else {
            submitChanges()
              .then(res => res.data && context.set({ user: res.data }))
          }
        }
      }
    }
  }, 1000)
}

function toggleForm(disabled) {
  const submitBtns = getUserForm()?.querySelectorAll('button[type="submit"]')
  Array.from(submitBtns).forEach(it => {
    it.disabled = disabled
    // Somewhat a temp fix
    if (disabled) it.classList.add('user-form-disabled-item')
    else it.classList.remove('user-form-disabled-item')
  })
}

async function submitChanges() {
  toggleForm(true)
  try {
    const bdField = getBirthdayField()
    return await client.patch('/user', {
      email: getEmailField().value,
      birthday: bdField ? new Date(bdField.value) : null,
      acceptAll: true,
      newsLetter: getNewsLetterCheckbox()?.value,
    })
  } catch (err) {
    toggleForm(false)
    const msg = err.response?.data?.message
    if (msg) {
      // FIXME: show the error somewhere else
      window.alert(msg)
    }
  }
}
