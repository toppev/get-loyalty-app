function isFullscreen() {
  return document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement
}

export {
  isFullscreen
}
