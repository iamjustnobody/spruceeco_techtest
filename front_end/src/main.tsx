import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { PlayerProvider } from "./context/player/playerContext.tsx";
import { ToastProvider } from "./context/toast/ToastProvider.tsx";
import { APP_ROUTES } from "./routes/router.tsx";

const router = createBrowserRouter(APP_ROUTES);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <BrowserRouter>
      <PlayerProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </PlayerProvider>
    </BrowserRouter> */}
    <PlayerProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </PlayerProvider>
  </StrictMode>
);
