import { replaceQRCodes } from "./QRCode"

type PAGE_RENDER_PROPS = { page: any }
/** Modules that are invoked every time a page renders. */
const ON_PAGE_RENDER_MODULES: ((props: PAGE_RENDER_PROPS) => any)[] = [
  replaceQRCodes,
]


export {
  ON_PAGE_RENDER_MODULES
}
