import React from 'react'
import Page from "../../model/Page"
import { useUserFormInitialValues } from "../../modules/userForm"

interface LoginFormProps {
  pages: Page[]
}

export default function RegisterForm({ pages }: LoginFormProps) {

  useUserFormInitialValues()

  // Can be configured by setting pathname to "register"
  const registerPage = pages.find(it => it.pathname === "register")

  // Otherwise try finding the element or default to the default form
  const html = registerPage?.html || DEFAULT_REGISTRATION

  return (
    <div
      className="fixed text-gray-500 flex items-center justify-center overflow-auto z-50 bg-opacity-40 left-0 right-0 top-0 bottom-0"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-gray-800 text-gray-500 m-3 h-96 rounded-xl shadow-2xl p-8 md:w-6/12"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// From the default /profile page
const DEFAULT_REGISTRATION = `
    <div id="registration-form">
        <section class="rounded-md my-36 m-auto h-auto w-11/12 max-w-xl bg-gray-800">
            <form id="user-form">
                <div class="rounded-md max-w-md w-full bg-gray-900 p-6 space-y-4">
                    <div class="mb-4">
                        <p class="text-gray-400">Loyalty App</p>
                        <h2 class="text-xl font-bold text-white">Your Information</h2>
                    </div>
                    <div>
                        <input id="user-email"
                               class="w-full p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
                               type="text"
                               placeholder="Email">
                    </div>
                    <!-- Uncomment for the birthday selector
                    <div class="">
                        <input type="date"
                               class="w-full p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
                               id="birthday-selector" name="birthday" autocomplete="bday"
                               min="1900-01-01" max="2010-12-31"/>
                    </div>
                    -->
                    <div class="my-2" style="white-space: nowrap;">
                        <input required type="checkbox" id="tos-privacy-accept" name="acceptTosPrivacy" value="true"/>
                        <label for="tos-privacy-accept" class="page-small-text form-check-label">I accept
                            <a draggable="true" data-highlightable="1" href="https://getloyalty.app/terms">terms of service</a>
                            <span> and </span>
                            <a draggable="true" data-highlightable="1" href="https://getloyalty.app/privacy">privacy policy</a>
                        </label>
                    </div>
                    <div>
                        <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200">
                            Register
                        </button>
                    </div>
                    <!-- TODO: whenever this is added
                    <div class="flex items-center justify-between">
                        <div class="flex flex-row items-center">
                            <input id="user-form-newsletter" type="checkbox" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
                            <label for="comments" class="ml-2 text-sm font-normal text-gray-400">Subscribe to the news letter</label>
                        </div>

                    </div>
                    -->
                </div>
            </form>
        </section>
    </div>
`
