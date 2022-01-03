async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.log('Failed to copy to clipboard', err)
    // fallback
    return document.execCommand('copy')
  }
}

export {
  copyToClipboard
}
