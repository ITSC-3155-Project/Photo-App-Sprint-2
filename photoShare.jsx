import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import "./src/index.css";          
import App from "./src/App.jsx";   

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("photoshareapp")
);
