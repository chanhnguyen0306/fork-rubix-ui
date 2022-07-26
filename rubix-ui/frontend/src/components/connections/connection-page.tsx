import React from "react";
import { Col, Row } from "antd";
import { Outlet, useLocation } from "react-router-dom";

import SearchableTree from "../searchable-tree/searchable-tree";

function ConnectionPage() {
  const location = useLocation();

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={4}>
          <SearchableTree />
        </Col>
        <Col span={20}>
          <Outlet key={location.pathname} />
        </Col>
      </Row>
    </div>
  );
}

export default ConnectionPage;
