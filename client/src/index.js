import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authAndContext/contextApi";
import { LocationProvider } from "./authAndContext/locationProvider";
import { AdProvider } from "./authAndContext/adProvider";
import { SearchProvider } from "./authAndContext/searchProvider";
import { ChatProvider } from "./authAndContext/chatProvider";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <LocationProvider>
        <SearchProvider>
          <AdProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </AdProvider>
        </SearchProvider>
      </LocationProvider>
    </AuthProvider>
  </BrowserRouter>
);
