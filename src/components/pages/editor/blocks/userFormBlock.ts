const userFormClass = "user-form"

function addUserFormBlock(blockManager: any) {
    blockManager.add(userFormClass, {
        label: `User Form`,
        // language=HTML
        content: (`
            <div>
                <form id=${userFormClass}>
                    <div>
                        <input type="email" id="user-email" name="email" value="" placeholder="Email address"/>
                        <input required type="checkbox" id="tos-privacy-accept" name="acceptTosPrivacy" value="true">
                        <label for="tos-privacy-accept">I accept <a href="/terms">terms of service</a> and <a href="/privacy">privacy policy</a></label><br>
                    </div>
                
                    <div>
                        <label for="birthday-selector">Birthday</label>
                        <input type="date" id="birthday-selector" name="birthday" autocomplete="bday" min="1900-01-01" max="2010-12-31">
                    </div>
                
                    <button id="user-form-submit" disabled>Save changes</button>
                </form>
            </div>
        `),
    });
}

export {
    addUserFormBlock
}