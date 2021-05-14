// This file is executed when the user navigates to this page (currently each page has their own JS).
// If you are a developer, you may find the source code useful: https://github.com/toppev/easy-loyalty-app/
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


// Some popular JS/CSS. Uncomment to include them if needed.
// loadCSS("https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css")
// loadCSS("https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css")
// loadCSS("https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css")
// loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js", function () { /* BootStrap JS code here */ })
// loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", function () { /* jQuery code here */ })
