// import Game from "@/pages/Game";
// import Home from "@/pages/Home";

import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

export const Home = lazy(() => import("@/pages/Home"));
export const Game = lazy(() => import("@/pages/Game"));

export const APP_ROUTES = [
  {
    name: "game",
    // path: "/game/*",  -> navigate to /game
    path: "/game",
    element: (
      <Suspense fallback={<div>Loading game...</div>}>
        <Game />
      </Suspense>
    ),
  },
  {
    name: "game_redirect",
    path: "/game/*",
    element: <Navigate to="/game" replace />,
  },
  {
    name: "home",
    path: "/",
    element: (
      <Suspense fallback={<div>Loading home...</div>}>
        <Home />
      </Suspense>
    ),
  },
  // {
  //   name: "not-found",
  //   path: "*",           // or "/*"; both navigate to /
  //   element: <NotFound />, // 404
  // },
  {
    name: "not_found_redirect_to_home",
    path: "*", // or "/*";
    element: <Navigate to="/" replace />,
  },
];

export const ROUTE_PATHS = Object.fromEntries(
  APP_ROUTES.map((r) => [r.name.toUpperCase(), r.path])
);
//ROUTE_PATHS.HOME === "/" and ROUTE_PATHS.GAME === "/game"
