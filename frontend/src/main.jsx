import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./contexts/UserContext";
import App from "./App";
import { CalcContextProvider } from "./contexts/CalcContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      <CalcContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </CalcContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
