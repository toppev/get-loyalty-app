const LOADING_HTML = `<h1 style="color: gray; text-align: center">Loading...</h1>`
const ERROR_HTML = `<h1 class="ErrorMessage">Couldn't load the page :(</h1>`

interface Page {
    _id: string
    pathname: string
    icon?: string
    externalURL?: string
    html?: string
}

export {
    LOADING_HTML,
    ERROR_HTML
}

export default Page