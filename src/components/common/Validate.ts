/**
 * Check if the given email is a valid email (<characters>@<characters>.<characters>)
 */
function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function alphanumeric(str: string) {
    const re = /^[a-zA-Z0-9_-]*$/;
    return re.test(str);
}

export {
    validateEmail,
    alphanumeric
}