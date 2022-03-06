const LOADING_HTML = `<h1 style="color: gray; text-align: center">Loading...</h1>`
const ERROR_HTML = `<h1 class="ErrorMessage">Couldn't load the page. An error occurred :(</h1>`
const EMPTY_PAGE_HTML = `<h1 class="ErrorMessage">Oops.. The page looks empty.</h1>`

interface Page {
  name: string;
  _id: string
  hidden: boolean
  pathname: string
  icon?: string
  externalPage?: {
    url: string,
    urlType: string
  }
  html?: string
}

export {
  LOADING_HTML,
  ERROR_HTML,
  EMPTY_PAGE_HTML
}

export default Page
