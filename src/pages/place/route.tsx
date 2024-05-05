import { lazy } from "react";
import { FaFilm } from "react-icons/fa";

const route = {
  path: "/place",
  label: "Place",
  icon: <FaFilm />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
