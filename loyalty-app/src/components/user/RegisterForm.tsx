import React from 'react'
import Page from "../../model/Page"

interface LoginFormProps {
  pages: Page[]
}

export default function RegisterForm({ pages }: LoginFormProps) {

  // Can be configured by setting pathname to "register"
  const registerPage = pages.find(it => it.pathname === "register")

  // Otherwise try finding the element or default to the default form
  const html = registerPage?.html || document.getElementById("user-registration")?.innerHTML || DEFAULT_REGISTRATION

  return (
    <div
      className="fixed text-gray-500 flex items-center justify-center overflow-auto z-50 backdrop-blur-sm bg-opacity-40 left-0 right-0 top-0 bottom-0">
      <div
        className="bg-white text-gray-500 m-3 h-96 rounded-xl shadow-2xl p-6 md:w-6/12"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// From the default /profile page
const DEFAULT_REGISTRATION = `
    <h2 class="text-light">Your Information</h2>
    <div id="i2fd1" class="gjs-row">
        <div id="ix5tz" class="gjs-cell">
            <div>
                <form id="user-form">
                    <div>
                        <label for="user-email" class="text-light">Email</label>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">@</span>
                        </div>
                        <input type="email" class="form-control" id="user-email" name="email" value=""
                               placeholder="email@example.com"/>
                    </div>
                    <div>
                        <label for="birthday-selector" class="text-light">Birthday</label>
                    </div>
                    <div class="input-group mb-3">
                        <input type="date" class="form-control" id="birthday-selector" name="birthday" autocomplete="bday"
                               min="1900-01-01" max="2010-12-31"/>
                    </div>
                    <div class="my-3">
                        <div>
                            <input required type="checkbox" id="tos-privacy-accept" name="acceptTosPrivacy" value="true"/>
                            <label for="tos-privacy-accept" class="page-small-text form-check-label">I accept
                                <a draggable="true" data-highlightable="1" href="https://getloyalty.app/terms">terms of service</a>
                                <span> and </span>
                                <a draggable="true" data-highlightable="1" href="https://getloyalty.app/privacy">privacy policy</a>
                            </label>
                        </div>
                        <button class="btn btn-primary my-2 pv-4">Register</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`
