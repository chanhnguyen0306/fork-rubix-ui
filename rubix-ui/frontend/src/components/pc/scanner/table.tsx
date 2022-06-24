import React, { useEffect, useState } from "react";
import { Scanner } from "../../../../wailsjs/go/main/App";
import { Button, Spin, Table } from "antd";
import { RedoOutlined } from "@ant-design/icons";

export const PcScanner = () => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setIsFetching(true);
    // const res = await Scanner("", "", 0, ["1662"]);
    const res = [
      //this is fake data
      {
        ip: "192.168.15.194",
        ports: [
          {
            service: "nube-assist",
            port: "1662",
            key: 1,
          },
        ],
      },
      {
        ip: "192.168.15.55",
        ports: [
          {
            service: "nube-assist",
            port: "1662",
            key: 1,
          },
          {
            service: "nube-assist-2",
            port: "1111",
            key: 2,
          },
        ],
      },
    ] as any;
    setData(res);
    setIsFetching(false);
  };

  const refreshList = () => {
    fetch();
  };
  return (
    <>
      <Button
        type="primary"
        onClick={refreshList}
        style={{ margin: "5px", float: "right" }}
      >
        <RedoOutlined /> Refresh
      </Button>
      <ScannerTable data={data} isFetching={isFetching} />
    </>
  );
};

const ScannerTable = (props: any) => {
  let { data, isFetching } = props;
  if (!data) return <></>;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      console.log("selectedRows: ", selectedRows);
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log("onSelect", record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log("onSelectAll", selected, selectedRows, changeRows);
    },
  };

  const columns = [
    {
      title: "Ip",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Port",
      dataIndex: "ports",
      render: (services: any[]) =>
        services.map((service) => (
          <p> {`${service.service}: ${service.port}`} </p>
        )),
      key: "ports",
    },
  ];

  return (
    <div>
      <Table
        rowKey="ip"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};
