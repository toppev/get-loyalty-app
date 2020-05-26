function format(text, args = []) {
    return text.replace(/{(\d+)}/g, function (match, number) {
        return args[number] ? args[number] : match
    });
}

module.exports = {
    format
}