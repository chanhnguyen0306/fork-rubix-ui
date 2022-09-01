import React from "react";
import Table from "antd/lib/table";

const DISPLAY_MAX_WIDTH = 1024;

const RbTable = (props: any) => (
  <Table
    {...props}
    scroll={{ x: DISPLAY_MAX_WIDTH }}
    pagination={{
      position: ["bottomLeft"],
      showSizeChanger: true,
      pageSizeOptions: [10, 50],
    }}
  />
);

export default RbTable;
