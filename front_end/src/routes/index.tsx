// import Game from "@/pages/Game";
// import Home from "@/pages/Home";

import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home"));
const Game = lazy(() => import("@/pages/Game"));

export const APP_ROUTES = [
  {
    name: "game",
    // path: "/game/*",  -> navigate to /game
    path: "/game",
    element: <Game />,
  },
  {
    name: "game_nav",
    path: "/game/*",
    element: <Navigate to="/game" replace />,
  },
  {
    name: "home",
    path: "/",
    element: <Home />,
  },
  // {
  //   name: "not-found",
  //   path: "*",           // or "/*"; both navigate to /
  //   element: <NotFound />, // 404
  // },
  {
    name: "not_found_nav",
    path: "*", // or "/*";
    element: <Navigate to="/" replace />,
  },
];

export const ROUTE_PATHS = Object.fromEntries(
  APP_ROUTES.map((r) => [r.name.toUpperCase(), r.path])
);
//ROUTE_PATHS.HOME === "/" and ROUTE_PATHS.GAME === "/game"
