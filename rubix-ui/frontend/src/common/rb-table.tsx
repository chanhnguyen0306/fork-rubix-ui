import React from "react";
import Table from "antd/lib/table";

const DISPLAY_MAX_WIDTH = 1024;

const RbTable = (props: any) => {
  return (
    <Table
      {...props}
      scroll={{ x: DISPLAY_MAX_WIDTH }}
      pagination={{
        position: ["bottomLeft"],
        showSizeChanger: true,
        pageSizeOptions: [10, 50, 100, 1000],
        locale: { items_per_page: "" },
      }}
    />
  );
};

export default RbTable;
