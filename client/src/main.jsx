import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SnackbarProvider } from "./components/SnackbarContext";
import "./main.css";
import store from "./store";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <GoogleOAuthProvider clientId="334641301701-nhbhjl0mo5vauq10cc85s3bd9ngi9v1n.apps.googleusercontent.com">
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"en-us"}>
        <BrowserRouter>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </Provider>
  </GoogleOAuthProvider>
);
