import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom" // <--- CHANGE THIS LINE: Import HashRouter instead of BrowserRouter
import './index.css'
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter> {/* <--- CHANGE THIS LINE: Use HashRouter here */}
      <App />
    </HashRouter>
  </React.StrictMode>
)