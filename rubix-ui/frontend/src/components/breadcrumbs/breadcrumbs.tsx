import React from "react";
import { Link } from "react-router-dom";
import { BreadcrumbProps } from "antd/lib/breadcrumb";
import { Breadcrumb } from "antd";

export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, "children">[];
}

const routes: Route[] = [
  {
    path: "index",
    breadcrumbName: "home",
  },
  {
    path: "first",
    breadcrumbName: "first",
    children: [
      {
        path: "/general",
        breadcrumbName: "General",
      },
      {
        path: "/layout",
        breadcrumbName: "Layout",
      },
      {
        path: "/navigation",
        breadcrumbName: "Navigation",
      },
    ],
  },
  {
    path: "second",
    breadcrumbName: "second",
  },
];

function itemRender(route: any, params: any, routes: any, paths: any) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={paths.join("/")}>{route.breadcrumbName}</Link>
  );
}

function RbxBreadcrumb() {
  return <Breadcrumb itemRender={itemRender} routes={routes} />;
}

export default RbxBreadcrumb;
