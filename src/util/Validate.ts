/**
 * Check if the given email is a valid email (<characters>@<characters>.<characters>)
 */
function isEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function isAlphanumeric(str: string) {
    const re = /^[a-zA-Z0-9_-]*$/;
    return re.test(str);
}

/**
 * Only check if contains <text>.<text> (matches subdomains)
 */
function isDomain(str: string) {
    const re = /\S+\.\S+/;
    return re.test(str);
}

export {
    isEmail,
    isAlphanumeric,
    isDomain
}