import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App/>, document.getElementById('root'))

serviceWorker.unregister()
/*
FIXME: cache not invalidated or something?
Enable after fixing

serviceWorker.register({
  onUpdate: async registration => {
    if (registration && registration.waiting) {
      await registration.unregister()
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  },
})
 */
