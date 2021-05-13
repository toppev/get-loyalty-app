import GrapesJS from 'grapesjs'
import gjsBlocksBasic from 'grapesjs-blocks-basic'
import grapesjsTabs from 'grapesjs-tabs'
import grapesjsTouch from 'grapesjs-touch'
import grapesjsTuiImageEditor from 'grapesjs-tui-image-editor'
import 'grapesjs/dist/css/grapes.min.css'
import React, { useContext, useEffect } from "react"
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
import AppContext from "../../../context/AppContext"

// So the editor is not rendered every time if the page id didn't change
export default React.memo(GrapesPageEditor, propsAreEqual)

function propsAreEqual(prev, next) {
  return prev.page._id === next.page._id
}

const UPLOAD_URL = `https://api.getloyalty.app/content/upload`

function GrapesPageEditor(props) {

  const url = `${backendURL}/page`
  const placeholderContext = usePlaceholderContext()
  const { user } = useContext(AppContext)


  useEffect(() => {
    const editor = GrapesJS.init({
      // Auto-saved on exit, see useEffect return cleanup function
      noticeOnUnload: false,
      container: `#page-editor`,
      allowScripts: true,
      canvas: {
        styles: ["./editorCanvas.css"],
        scripts: []
      },
      plugins: [
        gjsBlocksBasic,
        grapesjsTabs,
        grapesjsTouch,
        grapesjsTuiImageEditor
      ],
      storageManager: {
        type: 'remote',
        // Doesn't work? FIXME?
        // stepsBeforeSave: 5,

        // Either save or create if undefined
        urlStore: `${url}/${props.page._id || ""}/?gjsOnly=true`,
        urlLoad: `${url}/${props.page._id}/?gjsOnly=true`,
      },
      assetManager: {
        upload: UPLOAD_URL,
        multiUpload: false,
        // The server should respond with { data: ["https://...image.png] }
        autoAdd: true,
        headers: {
          "X-Loyalty-User": user.id
        }
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

    const saveIfNeeded = () => {
      if (editor.getDirtyCount()) {
        editor.store()
      }
    }

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
