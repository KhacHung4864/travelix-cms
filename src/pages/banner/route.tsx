import { lazy } from "react";
import { FaFilm } from "react-icons/fa";

const route = {
  path: "/banner",
  label: "Banner",
  icon: <FaFilm />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
