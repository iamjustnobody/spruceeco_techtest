import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./context/player/playerContext.tsx";
import { ToastProvider } from "./context/toast/ToastProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>
);
