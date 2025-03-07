import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { store } from "./Redux/store.jsx";
import { Provider } from "react-redux";
import "./css/user.css"
import "./css/gamelobby.css"
import "./css/game.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
