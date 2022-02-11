import GrapesJS from 'grapesjs'
import gjsBlocksBasic from 'grapesjs-blocks-basic'
import grapesjsTabs from 'grapesjs-tabs'
import grapesjsTouch from 'grapesjs-touch'
import grapesjsTuiImageEditor from 'grapesjs-tui-image-editor'
import { client } from '../../../config/axios'
import 'grapesjs/dist/css/grapes.min.css'
import React, { useEffect } from "react"
import { addPlaceholderBlock, registerListener } from "./blocks/placeholderBlock"
import { addCampaignsBlock } from "./blocks/campaignsBlock"
import { addUserRewardsBlock } from "./blocks/userRewardsBlock"
import { uploadHtmlCss } from "../../../services/pageService"
import { addRichTextEditorPlaceholders } from "./richPlaceholder"
import { usePlaceholderContext } from "./placeholderContext"
import { addQRCodeType } from "./blocks/qrCodeBlock"
import { addEnableNotificationsButton } from "./blocks/enableNotificationsBlock"
import { backendURL } from "../../../config/axios"
import { addProductsBlock } from "./blocks/productsBlock"
import { addUserQRBlock } from "./blocks/userQRCode"
import { addRewardQRBlock } from "./blocks/rewardQRCode"
import { addUserFormBlock } from "./blocks/userFormBlock"
import codeEditor from "./codeeditor/codeEditor"
import { addReferralButton } from "./blocks/referralButton"

// So the editor is not rendered every time if the page id didn't change
export default React.memo(GrapesPageEditor, propsAreEqual)

function propsAreEqual(prev, next) {
  return prev.page._id === next.page._id
}


function GrapesPageEditor(props) {

  const url = `${backendURL}/page`
  const pageId = props.page._id
  const uploadUrl = `${backendURL}/page/${pageId}/upload-static`

  const placeholderContext = usePlaceholderContext()

  const pageCSS = [
    `${backendURL}/page/common/static/main.css`,
    // hard code the default ones here for now
    "https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css",
  ]
  const pageJS = [
    `${backendURL}/page/common/static/main.js`,
    `${backendURL}/page/${pageId}/static/main.js`,
  ]

  const safeParseJson = (json) => {
    try {
      return JSON.parse(json)
    } catch (err) {
      console.log("Failed to safe parse json", err)
    }
  }

  useEffect(() => {
    let editor

    async function load() {

      // TODO: handle failures
      const { data } = await client.get(`${url}/${pageId}/?gjsOnly=true`)
      const getHtml = async () => {
        const res = await client.get(`${url}/${pageId}/static/index.html`)
        return res.data
      }

      editor = GrapesJS.init({
        // Auto-saved on exit, see useEffect return cleanup function
        noticeOnUnload: false,
        container: `#page-editor`,
        allowScripts: true,
        canvas: {
          styles: ["./editorCanvas.css", ...pageCSS],
          scripts: [...pageJS]
        },
        plugins: [
          gjsBlocksBasic,
          grapesjsTabs,
          grapesjsTouch,
          grapesjsTuiImageEditor
        ],
        components: safeParseJson(data['gjs-components']) || (await getHtml()),
        style: safeParseJson(data['gjs-styles']),
        storageManager: {
          type: 'remote',
          // stepsBeforeSave: 5, // Doesn't work? FIXME?
          autoload: false, // we load manually and fallback to the raw HTML
          // urlLoad: `${url}/${pageId}/?gjsOnly=true`,
          // Either save or create if undefined
          urlStore: `${url}/${pageId || ""}/?gjsOnly=true`,
        },
        assetManager: {
          upload: uploadUrl,
          multiUpload: false,
          // The server should respond with { data: ["https://...image.png] }
          autoAdd: true
        }
      })

      editor.on('storage:start:store', () => {
        uploadHtmlCss(props.page, editor.getHtml(), editor.getCss())
          .then(() => props.setError())
          .catch(err => {
            props.setError(err?.response?.message || `Oops... Something went wrong.
                    ${`Status code: ${err?.response?.status}` || err}.
                    This may be caused by invalid placeholders.`, editor.store)
          })
      })

      // Add custom blocks
      const bm = editor.BlockManager
      registerListener(editor, props.selectPlaceholder)

      addRichTextEditorPlaceholders(editor, placeholderContext)

      addCampaignsBlock(bm)
      addProductsBlock(bm)
      addUserRewardsBlock(bm)

      addQRCodeType(editor)
      // addQRCodeBlock(bm);
      addUserQRBlock(bm)
      addRewardQRBlock(bm)

      addPlaceholderBlock(bm)
      addEnableNotificationsButton(bm)
      addReferralButton(bm)

      addUserFormBlock(bm)

      codeEditor(editor)
    }

    const saveIfNeeded = () => {
      if (editor?.getDirtyCount()) {
        editor.store()
      }
    }

    load().then()

    // Save when closing
    return function () {
      saveIfNeeded()
    }
  })

  return (
    <div>
      <div id="page-editor"/>
    </div>
  )
}
