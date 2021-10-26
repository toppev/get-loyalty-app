// This file is executed when the user opens the web application.
// If you are a developer, you may find the source code useful: https://github.com/toppev/get-loyalty-app/
// Scroll down to add your JavaScript code.

// -------------------- Start of standard library --------------------
// Here are some functions you may find useful. You can delete them if you don't need them.

/**
 * Add external CSS
 * @param href link to the CSS file
 */
function loadCSS(href) {
  const link = document.createElement("link")
  link.type = "text/css"
  link.rel = "stylesheet"
  link.href = href
  document.head.appendChild(link)
}

/**
 * Dynamically load scripts from a URL
 * @param src the URL to the script
 * @param onLoad callback function that is called when the script has loaded
 */
function loadScript(src, onLoad) {
  const script = document.createElement("script")
  document.head.appendChild(script)
  script.onload = onLoad
  script.src = src
}

// -------------------- End of the "library" --------------------
// You can add your JavaScript code below. Here are some examples:

// window.alert("Hello world!")


// Used by default pages, only remove if you really know you don't need this
loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js", function () { /* BootStrap JS code here */ })
loadCSS("https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css")

// Some popular JS/CSS. Uncomment to include them if needed.
// loadCSS("https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css")
// loadCSS("https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css")
// loadCSS("https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css")
// loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", function () { /* jQuery code here */ })

console.log("Common main.js has been loaded successfully.")
