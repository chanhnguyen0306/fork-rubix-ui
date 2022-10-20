import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

import { Breadcrumb, Button } from "antd";

export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, "children">[];
}

function itemRender(route: any, params: any, routes: any, paths: any) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <NavLink style={{ color: "#1890ff" }} to={route.path}>
      {route.breadcrumbName}
    </NavLink>
  );
}

function RbxBreadcrumb(props: any) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 0 10px 0" }}>
      <Button
        style={{ marginRight: "5px" }}
        shape="circle"
        icon={<LeftOutlined />}
        size="small"
        onClick={()=> navigate(-1)}
      />
      <Breadcrumb itemRender={itemRender} routes={props.routes} />
    </div>
  );
}

export default RbxBreadcrumb;
