const userFormclass = "user-form"

function addEmailBlock(blockManager: any) {
    blockManager.add(userFormclass, {
        label: `User Form`,
        // language=HTML
        content: (`
            <div>
            <form id=${userFormclass} action="" onsubmit="submitEmail()">
                
                <div>
                    <input type="email" id="user-email" name="email" value="" placeholder="Email address"/>
                    <input required type="checkbox" id="tos-privacy-accept" name="acceptTosPrivacy" value="true">
                    <label for="tos-privacy-accept">I accept <a href="/terms">terms of service</a> and <a href="/privacy">privacy policy</a></label><br>
                </div>
                
                <div>
                    <label for="birthday-selector">Birthday</label>
                    <input type="date" id="birthday-selector" name="birthday" min="1900-01-01" max="2020-12-31">
                </div>
                
                <div>
                    <input type="submit" value="Submit">
                </div>
                
            </form>
            <script>
                const url = "http://localhost:3001" + "/user"
                // const url = window.location.origin + "/api/user"
                
                const emailField = document.getElementById("user-email");
                const birthdayField = document.getElementById("birthday-selector");
                
                fetch(url + '/profile', {
                     "method": "GET",
                     "credentials": "include"
                }).then(res => {
                    res.json().then(json => {
                        emailField.value = json.email || "";
                        if(json.birthday) {
                            const bd = new Date(Date.parse(json.birthday)).toISOString()
                            birthdayField.value = bd.slice(0, 10);
                        }
                    }) 
                });

                function submitEmail() {
                    if (emailField.value.length !== 0) {
                        fetch(url, {
                            "headers": {
                                "content-type": "application/json",
                                "x-xsrf-token": getCookie("XSRF-TOKEN")
                            },
                            "body": JSON.stringify({
                                        email: emailField.value,
                                        birthday: new Date(birthdayField.value),
                                        acceptAll: true,
                            }),
                            "method": "PATCH",
                            "credentials": "include"
                        });
                    }
                }

                function getCookie(name) {
                    const cookie = RegExp(name + "=[^;]+").exec(document.cookie);
                    return decodeURIComponent(!!cookie ? cookie.toString().replace(/^[^=]+./, "") : "");
                }
            </script>
            </div>
        `),
    });
}

export {
    addEmailBlock
}