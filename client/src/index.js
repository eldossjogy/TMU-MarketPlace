import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authAndContext/contextApi";
import { LocationProvider } from "./authAndContext/locationProvider";
import { AdProvider } from "./authAndContext/adProvider";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <LocationProvider>
        <AdProvider>
          <App />
        </AdProvider>
      </LocationProvider>
    </AuthProvider>
  </BrowserRouter>
);
