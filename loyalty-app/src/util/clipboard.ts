async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (ex) {
        // fallback
        return document.execCommand('copy')
    }
}

export {
    copyToClipboard
}
