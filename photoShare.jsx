import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.css";
import PhotoApp from "./components/photoShare/PhotoApp.jsx"; 

ReactDOM.render(
  <BrowserRouter>
    <PhotoApp />
  </BrowserRouter>,
  document.getElementById("photoshareapp")
);
