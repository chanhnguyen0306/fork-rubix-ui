import React from "react";
import { Col, Row } from "antd";
import { Outlet, useLocation } from "react-router-dom";

import SearchableTree from "../searchable-tree/searchable-tree";

function ConnectionPage() {
  const location = useLocation();

  return (
    <>
      <Outlet key={location.pathname} />
    </>
  );
}

export default ConnectionPage;
